# Architecture

This document describes the system design of MO3TAMAD: its layered structure, middleware chain, authentication model, authorization model, and the certificate generation pipeline.

---

## Table of Contents

1. [Layered Architecture](#layered-architecture)
2. [Middleware Chain](#middleware-chain)
3. [Authentication — Opaque Token / Redis Sessions](#authentication)
4. [Authorization — Casbin RBAC](#authorization)
5. [Exam Lifecycle & Grading](#exam-lifecycle--grading)
6. [Certificate Generation Pipeline](#certificate-generation-pipeline)
7. [Frontend Architecture](#frontend-architecture)
8. [Data Flow: Taking an Exam](#data-flow-taking-an-exam)

---

## Layered Architecture

The backend follows a straightforward layered structure:

```
cmd/main.go
    └── app/app.go               ← Dependency injection: wires config, DB, Redis, logger, server
            └── internal/server/ ← HTTP handlers (one file per resource domain)
                    ├── Uses model/ structs for DB access via GORM
                    └── Uses pkg/  for cross-cutting concerns
                            ├── pkg/authz/       Casbin enforcer
                            ├── pkg/cache/       Redis wrapper
                            ├── pkg/certificate/ PDF/PNG generator
                            ├── pkg/email/       SMTP mailer
                            ├── pkg/oauth2/      Token issuance & introspection
                            └── pkg/shortuuid/   Base57 UUID generator
```

Each HTTP handler in `internal/server/` is a method on `*Server`, which holds all injected dependencies (DB, cache, config, mailer, etc.). There is no separate repository or service layer — handlers call GORM directly. This keeps the codebase small and readable for a project of this scope.

---

## Middleware Chain

Every request passes through this chain before reaching a handler:

```
Request
  │
  ▼
[RequestsLogger]   — Zap structured logging (method, path, latency, status)
  │
  ▼
[CORS]             — gofiber/cors with permissive config for local dev
  │
  ▼
[Protect]          — Token introspection via Redis (see Authentication below)
  │                  Stores authenticated client in Fiber request locals
  ▼
[Authorization]    — Casbin policy check (see Authorization below)
  │                  Only applied to routes that require a specific permission
  ▼
[Handler]          — Business logic
```

The `Protect` middleware is applied globally to the `/api` group. The `Authorization` middleware is applied per-route with the required resource as argument, e.g.:

```go
examsRoutes.Post("/", s.Middleware.Authorization(authz.CreateExam), s.CreateExam)
```

Auth routes (`/auth/oauth/...`) are outside the `/api` group and receive no protection middleware.

---

## Authentication

MO3TAMAD uses an **opaque token / Redis session** approach rather than stateless JWT.

### Why opaque tokens instead of JWT?

- **Instant revocation**: logout deletes the session from Redis — the token is immediately invalid. With JWT this requires a blocklist.
- **Simplicity**: no signing keys to rotate, no token expiry edge cases on the client.
- **Tradeoff**: every authenticated request requires a Redis lookup (low latency on the same Docker network).

### Login Flow

```
Client                       API Server                     Redis        MySQL
  │                              │                             │             │
  │─── POST /auth/oauth/login ──▶│                             │             │
  │    Basic Auth: email:pass    │                             │             │
  │                              │── lookup account ──────────────────────▶│
  │                              │◀─ account + hashed password ────────────│
  │                              │                             │             │
  │                              │  bcrypt.Compare(plain, hash)            │
  │                              │                             │             │
  │                              │── SET access_token ────────▶│             │
  │                              │── SET refresh_token ────────▶│             │
  │                              │── INSERT Token row ──────────────────────▶│
  │                              │── INSERT Session row ────────────────────▶│
  │                              │                             │             │
  │◀── {access_token, refresh_token, scope, expires_in} ──────│             │
```

### Request Authentication (Protect middleware)

```go
// internal/middleware/protect.go (simplified)
token := strings.TrimPrefix(c.Get("Authorization"), "Bearer ")
client, err := oauth2.Inspect(token)   // Redis GET → deserialize client
if err != nil {
    return c.SendStatus(fiber.StatusUnauthorized)
}
c.Locals("client", client)             // available to all downstream handlers
```

### Token Refresh

`POST /auth/oauth/refresh/token` atomically deletes the old token pair from Redis and MySQL and issues a new pair, preventing replay of stale refresh tokens.

---

## Authorization

Authorization uses **Casbin v2** with a GORM-backed policy store and an in-process `CachedEnforcer`.

### Policy Model (`pkg/authz/model.conf`)

```ini
[request_definition]
r = user, feature, action

[policy_definition]
p = user, feature, action

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = p.user == r.user && ((g(p.feature, r.feature) || (p.feature == r.feature)) || p.feature == 'admin')
```

- A **policy** is a triple `(role, resource, action)` — e.g., `(admin, exams, create)`.
- The `admin` wildcard in the matcher means any policy with `feature = 'admin'` matches all resources.
- Policies are stored in the database and can be managed at runtime via `/api/v1/system/policies`.

### Built-in Resources (`pkg/authz/resources.json`)

| Resource | Actions |
|---|---|
| `admin` | `all` (superuser wildcard) |
| `users` | `getall`, `get`, `create`, `update`, `delete` |
| `exams` | `getall`, `get`, `create`, `update`, `delete` |
| `register` | `all` |

### Authorization Middleware

```go
// internal/middleware/authorization.go (simplified)
func (m *Middleware) Authorization(resource string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        client := c.Locals("client").(*oauth2.Client)
        allowed, _ := m.Authz.Enforcer.Enforce(client.RoleDesc, resource, "")
        if !allowed {
            return c.SendStatus(fiber.StatusForbidden)
        }
        return c.Next()
    }
}
```

### Policy Mirror for the Frontend

The endpoint `GET /api/v1/accounts/policies/ui` returns the authenticated user's effective permissions as a flat JSON map (e.g., `{"examsCreate": true, "registerAll": true}`). The frontend stores this in a cookie and uses it to conditionally render UI elements (buttons, menu items, routes). This avoids hardcoding role names in the frontend.

---

## Exam Lifecycle & Grading

### State Transitions

The `Registration.Status` field is a derived string computed by `calculateRegStatus()` on every write. The states are:

| Status | Condition |
|---|---|
| `waiting-approval` | `IsConsidered = false` |
| `not-started` | `IsConsidered = true`, `StartTime = nil` |
| `started` | `StartTime != nil`, `EndTime > now`, `FinishedAt = nil` |
| `passed` | `FinishedAt != nil`, `Passed = true` |
| `not-passed` | `FinishedAt != nil`, `Passed = false`, `IsCheated = false` |
| `cheated` | `IsCheated = true` |

### `Trans` Pre-population

When a user registers for an exam, one `Trans` (transaction/answer) row is immediately created per question with `OptionId = nil`. This design:

1. **Simplifies grading** — the grading loop is a simple join: `SELECT * FROM trans WHERE registration_id = ?` then check each `Option.IsCorrect`.
2. **Captures a question snapshot** — questions are associated at registration time, so subsequent edits to the exam's question bank don't affect in-progress exams.
3. **Enables progress tracking** — null answers are distinguishable from wrong answers.

### Grading (`FinishedExam` handler)

```go
// Simplified grading logic
correct := 0
for _, t := range trans {
    if t.OptionId != nil {
        var option model.Option
        db.First(&option, t.OptionId)
        if option.IsCorrect {
            correct++
        }
    }
}
result := (correct * 100) / len(trans)   // integer division
registration.Result = result
registration.Passed = result >= exam.PassingScore
```

Note: integer division means fractional percentages are truncated (e.g., 7/9 → 77, not 77.8).

---

## Certificate Generation Pipeline

Certificates are generated server-side when an admin approves an applicant.

```
1. Read template
   pkg/certificate/certificate.html
   (HTML with {{name}}, {{company}}, {{exam}}, {{grade}}, {{date}} placeholders)

2. String-replace placeholders
   strings.ReplaceAll(html, "{{name}}", account.Name) ...

3. Write to temp file
   /tmp/<shortUUID>.html

4. Convert HTML → PDF
   wkhtmltopdf --page-width 435pt --page-height 274pt  \
               /tmp/<uuid>.html  public/certificates/<uuid>.pdf
   (landscape credit-card dimensions for a clean certificate aspect ratio)

5. Convert PDF → PNG
   pdftoppm -r 150 -png public/certificates/<uuid>.pdf  \
            public/certificates/<uuid>
   (150 DPI is sufficient for screen display)

6. Store URL
   registration.CertificateUrl = <shortUUID>
   served at GET /certificates/:certUrl
```

The `shortUUID` is generated by `pkg/shortuuid` — a custom base57 encoder (alphabet excludes `0`, `O`, `I`, `l` to avoid visual ambiguity). This makes certificate URLs unguessable without requiring a database lookup to validate them.

---

## Frontend Architecture

### State Management

| Concern | Solution |
|---|---|
| Auth state (user, token, policies) | React Context (`AuthContext`) + js-cookie |
| UI state (loading, alerts) | Redux Toolkit (`ui-slice`) |
| Server data | Direct Axios calls in components / custom hooks |

Auth state is persisted in cookies so it survives page refresh. On app load, `AuthContext` reads cookies to restore the session.

### Role-based Routing

```tsx
// src/pages/index.tsx (simplified)
useEffect(() => {
    if (policies.examsGetall) {
        navigate("/company/exams-projects");   // admin or assistant
    } else if (policies.registerAll) {
        navigate("/");                          // exam taker
    } else {
        navigate("/login");
    }
}, [policies]);
```

Route protection is implicit: pages read `policies` from context and redirect if the required policy is absent. There is no centralized route guard component — each page is self-protecting.

### Custom Hook: `use-fetch`

A thin wrapper around Axios that handles loading state, error state, and automatic re-fetch on dependency changes. Used throughout the company dashboard for data tables.

### Custom Hook: `use-filter`

Client-side filtering helper for exam catalog and question lists — avoids unnecessary API calls for simple search/filter interactions.
