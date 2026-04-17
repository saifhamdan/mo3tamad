# MO3TAMAD Backend

Go REST API server for the MO3TAMAD certified assessments platform.
Built with [Fiber v2](https://gofiber.io/), [GORM](https://gorm.io/), [Casbin](https://casbin.org/), and Redis.

See the [root README](../README.md) for a full system overview and the [Architecture doc](../docs/ARCHITECTURE.md) for design details.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Go | 1.20+ | [golang.org](https://golang.org/dl/) |
| MySQL | 8.0 | Or use Docker Compose |
| Redis | 6+ | Or use Docker Compose |
| wkhtmltopdf | latest | Required for certificate PDF generation |
| poppler-utils | latest | Provides `pdftoppm` for PDF → PNG conversion |

**Install system dependencies on Ubuntu/Debian:**
```bash
sudo apt install wkhtmltopdf poppler-utils
```

---

## Configuration

Copy the example environment file and edit it:

```bash
cp app.env.example app.env
```

| Variable | Default | Description |
|---|---|---|
| `HTTP_HOST` | `:` | Host to bind (empty = all interfaces) |
| `HTTP_PORT` | `5000` | Port the API listens on |
| `HTTP_OAUTH_TOKEN_EXPIRES_IN` | `3600` | Token TTL in seconds (informational only — Redis controls actual expiry) |
| `MYSQL_HOST` | `mysql` | MySQL hostname |
| `MYSQL_PORT` | `3306` | MySQL port |
| `MYSQL_USER` | `mo3tamad` | MySQL username |
| `MYSQL_PASSWORD` | — | MySQL password |
| `MYSQL_DB` | `mo3tamad` | MySQL database name |
| `REDIS_HOST` | `redis:6379` | Redis address |
| `REDIS_PASSWORD` | — | Redis password (leave `null` if none) |
| `LOG_FILE` | `backend.log` | Rotating log file path |

---

## Running Locally (without Docker)

```bash
# 1. Install Go dependencies
go mod download

# 2. Configure app.env pointing to your local MySQL and Redis
cp app.env.example app.env

# 3. Run
go run cmd/main.go
```

The API will be available at `http://localhost:5000`.

Database schema is **auto-migrated** on startup via GORM. Seed data for categories and levels is seeded via `data/seed_data.go`.

---

## Running with Docker Compose

From the repository root:

```bash
docker build -t mo3tamad-backend ./backend
docker compose up -d
```

To run only the backend stack (MySQL + Redis + backend):

```bash
cd backend
docker compose -f stack.yaml up -d
```

---

## Make Targets

```bash
make dockercontainer   # run the backend container (port 5000)
make dockerdev         # start the full dev stack via stack.yaml
```

---

## Package Guide

| Package | Path | Description |
|---|---|---|
| **authz** | `pkg/authz/` | Casbin `CachedEnforcer` setup; policy resource constants; `model.conf` for RBAC model |
| **cache** | `pkg/cache/` | Thin Redis wrapper (`Set`, `Get`, `Delete`) with JSON marshalling |
| **certificate** | `pkg/certificate/` | HTML template → `wkhtmltopdf` PDF → `pdftoppm` PNG pipeline |
| **db** | `pkg/db/` | MySQL GORM connection factory with auto-migrate |
| **email** | `pkg/email/` | SMTP mailer; HTML templates for approve/decline emails |
| **http** | `pkg/http/` | Fiber app factory; standardised response helpers (`HttpResponseOK`, `HttpResponseBadRequest`, etc.) |
| **logger** | `pkg/logger/` | Zap logger with Lumberjack rotating file sink |
| **oauth2** | `pkg/oauth2/` | Token issuance (opaque random string), introspection (Redis lookup), bcrypt password helpers |
| **redis** | `pkg/redis/` | Redis client factory (`go-redis/redis v8`) |
| **shortuuid** | `pkg/shortuuid/` | Custom base57 UUID encoder — excludes visually ambiguous characters (`0`, `O`, `I`, `l`). Used for certificate and thumbnail URLs |

### `pkg/shortuuid` — Custom Base57 Encoder

This is a self-contained, hand-rolled implementation worth highlighting. It encodes a UUID into a compact, URL-safe string using a 57-character alphabet. The choice of base57 (vs. base64 or base62) deliberately excludes characters that look similar in certain fonts, making certificate URLs easier to transcribe if needed.

---

## Handler Files

Each file in `internal/server/` corresponds to one resource domain:

| File | Resource |
|---|---|
| `accounts.go` | User account CRUD |
| `authz.go` | Casbin roles, resources, policies |
| `categories.go` | Exam category lookup |
| `comments.go` | Exam comments CRUD |
| `companies.go` | Company CRUD |
| `exams.go` | Exam CRUD + thumbnail upload |
| `helpers.go` | Shared handler utilities |
| `levels.go` | Difficulty level lookup |
| `oauth.go` | Login, signup, logout, refresh |
| `options.go` | Question option helpers |
| `questions.go` | Question CRUD |
| `registrations.go` | Exam enrollment lifecycle (register, start, answer, finish, approve, decline) |
| `routes.go` | Route registration for all handlers |
| `server.go` | `Server` struct definition |
| `sessions.go` | Session management |
| `trans.go` | Per-question answer submission |
