# Database Schema

MO3TAMAD uses **MySQL 8.0** with **GORM** for schema management (auto-migration on startup).

---

## Table of Contents

1. [Entity Relationship Overview](#entity-relationship-overview)
2. [Tables](#tables)
   - [accounts](#accounts)
   - [companies](#companies)
   - [roles](#roles)
   - [exams](#exams)
   - [categories & exam_categories](#categories--exam_categories)
   - [levels](#levels)
   - [questions](#questions)
   - [options](#options)
   - [registrations](#registrations)
   - [trans](#trans)
   - [comments](#comments)
   - [tokens](#tokens)
   - [sessions](#sessions)
   - [resources & actions](#resources--actions)
3. [Key Design Decisions](#key-design-decisions)

---

## Entity Relationship Overview

```
companies ──< accounts >──< registrations >── exams
                │                │               │
                │               trans          questions ──< options
                │                               │
                └──< comments >──┘           exam_categories
                                                │
                                            categories

accounts ──< tokens
accounts ──< sessions
roles ──< accounts
resources ──< actions
```

**Cardinalities**

| Relationship | Type |
|---|---|
| Company → Accounts | one-to-many |
| Account → Registrations | one-to-many |
| Exam → Registrations | one-to-many |
| Registration → Trans | one-to-many |
| Exam → Questions | one-to-many |
| Question → Options | one-to-many |
| Exam ↔ Categories | many-to-many (via `exam_categories`) |
| Account → Comments | one-to-many |
| Exam → Comments | one-to-many |
| Role → Accounts | one-to-many |

---

## Tables

### accounts

Stores all users regardless of role (admin, assistant, exam taker).

| Column | Type | Description |
|---|---|---|
| `account_id` | int PK auto | Primary key |
| `name` | varchar | Display name |
| `email` | varchar (unique) | Login email |
| `mobile` | varchar | Phone number |
| `password` | varchar | bcrypt hash |
| `role_id` | int FK → roles | Determines permissions |
| `active` | bool (default true) | Soft disable flag |
| `status` | varchar | Account status string |
| `company_id` | int FK → companies | Company the account belongs to (null for exam takers) |

---

### companies

Represents an organization that creates and manages exams.

| Column | Type | Description |
|---|---|---|
| `company_id` | int PK auto | Primary key |
| `name` | varchar | Company name |
| `desc` | varchar | Description |
| `is_verified` | bool (default true) | Verification status |
| `phone_number` | varchar | Contact phone |

---

### roles

Lookup table for user roles.

| Column | Type | Description |
|---|---|---|
| `role_id` | int PK auto | Primary key |
| `desc` | varchar | Role name (e.g., `admin`, `assistant`, `user`) |
| `status` | varchar | Active/inactive |

---

### exams

An exam project created by a company.

| Column | Type | Description |
|---|---|---|
| `exam_id` | int PK auto | Primary key |
| `duration` | time.Duration | Exam duration in nanoseconds (stored as bigint); minutes used in business logic |
| `title` | varchar | Exam title |
| `description` | text | Exam description |
| `thumbnail_url` | varchar | Short UUID path to WebP thumbnail |
| `certification_url` | varchar | (Unused — certificate URL is per-registration) |
| `passing_score` | int | Minimum percentage to pass |
| `company_id` | int FK → companies | Owning company |
| `questions_count` | int | Denormalized count |
| `level_id` | int FK → levels | Difficulty level |

---

### categories & exam_categories

`categories` is a lookup table; `exam_categories` is the join table for the many-to-many relationship.

**categories**

| Column | Type | Description |
|---|---|---|
| `category_id` | int PK auto | Primary key |
| `desc` | varchar | Category name (e.g., `Go`, `Java`, `Networking`) |

**exam_categories** (auto-managed by GORM `many2many`)

| Column | Type |
|---|---|
| `exam_id` | int FK |
| `category_id` | int FK |

---

### levels

Difficulty levels for exams.

| Column | Type | Description |
|---|---|---|
| `level_id` | int PK auto | Primary key |
| `desc` | varchar | Level name (e.g., `Beginner`, `Intermediate`, `Advanced`) |

---

### questions

A question belonging to a specific exam.

| Column | Type | Description |
|---|---|---|
| `question_id` | int PK auto | Primary key |
| `exam_id` | int FK → exams | Owning exam |
| `text` | text | Question content (may contain HTML from WYSIWYG editor) |

Options are cascade-deleted (`OnDelete:CASCADE`) when a question is deleted.

---

### options

An answer option for a question. Exactly one option per question should have `is_correct = true`.

| Column | Type | Description |
|---|---|---|
| `option_id` | int PK auto | Primary key |
| `question_id` | int FK → questions | Owning question |
| `text` | varchar | Option text |
| `is_correct` | bool | Whether this is the correct answer |

---

### registrations

Records a user's enrollment in an exam and tracks the entire lifecycle.

| Column | Type | Description |
|---|---|---|
| `registration_id` | int PK auto | Primary key |
| `account_id` | int FK → accounts | Exam taker |
| `exam_id` | int FK → exams | Enrolled exam |
| `start_time` | datetime (nullable) | When the user clicked Start |
| `end_time` | datetime (nullable) | `start_time + duration`; server-enforced deadline |
| `finished_at` | datetime (nullable) | When the user submitted (or timer expired) |
| `issued_at` | datetime (nullable) | When the certificate was issued (admin approval) |
| `is_cheated` | bool | Anti-cheat flag set by client or admin |
| `is_considered` | bool | Admin enrollment approval |
| `certificate_url` | varchar (nullable) | Short UUID for certificate PNG |
| `passed` | bool | Whether the user achieved ≥ passing score |
| `result` | int | Score percentage (0–100) |
| `status` | varchar | Derived status string (see lifecycle doc) |

---

### trans

Per-question answer records. One row per `(registration, question)` pair, created at registration time.

| Column | Type | Description |
|---|---|---|
| `trans_id` | int PK auto | Primary key |
| `account_id` | int FK → accounts | Exam taker |
| `registration_id` | int FK → registrations | Owning registration |
| `question_id` | int FK → questions | The question being answered |
| `option_id` | int FK → options (nullable) | Selected answer; null = unanswered |

> **Design note**: All `Trans` rows are created with `option_id = null` when the user registers. This pre-population means the grading loop always has a complete set of rows to iterate, making unanswered questions indistinguishable from wrong answers from the scoring perspective.

---

### comments

User comments on exams (visible on the exam detail page).

| Column | Type | Description |
|---|---|---|
| `comment_id` | int PK auto | Primary key |
| `exam_id` | int FK → exams | Commented exam |
| `account_id` | int FK → accounts | Author |
| `desc` | text | Comment body |

---

### tokens

Persistent token records in MySQL, mirroring what is stored in Redis.

| Column | Type | Description |
|---|---|---|
| `token_id` | int PK auto | Primary key |
| `account_id` | int FK → accounts | Token owner |
| `access_token` | varchar | Opaque access token string |
| `refresh_token` | varchar | Opaque refresh token string |
| `scope` | varchar | Role/scope string |
| `expires_in` | int | TTL in seconds (informational; Redis controls actual expiry) |

---

### sessions

Tracks active login sessions (one per device/login).

| Column | Type | Description |
|---|---|---|
| `session_id` | int PK auto | Primary key |
| `account_id` | int FK → accounts | Session owner |
| `ip_address` | varchar | Client IP at login time |

---

### resources & actions

Support tables for the Casbin policy management API. Resources map to Casbin features; actions map to Casbin actions.

**resources**

| Column | Type | Description |
|---|---|---|
| `resource_id` | int PK auto | Primary key |
| `desc` | varchar | Resource name (e.g., `exams`) |
| `type` | varchar | Resource type (e.g., `api`) |
| `status` | varchar | Active/inactive |

**actions**

| Column | Type | Description |
|---|---|---|
| `action_id` | int PK auto | Primary key |
| `resource_id` | int FK → resources | Owning resource |
| `desc` | varchar | Action name (e.g., `create`) |
| `checked` | bool | UI helper flag |
| `status` | varchar | Active/inactive |

---

## Key Design Decisions

### 1. Derived `status` field vs. computed on read

`Registration.Status` is a **string written on every save** rather than computed on read. This means the current status is always queryable with a simple `WHERE status = ?`. The tradeoff is that `calculateRegStatus()` must be called before every `DB.Save(registration)`.

### 2. `Trans` pre-population at registration time

See [Architecture → Trans Pre-population](ARCHITECTURE.md#trans-pre-population).

### 3. `IssuedAt` vs. `FinishedAt`

These are distinct timestamps:
- `FinishedAt` — when the user submitted the exam (automated).
- `IssuedAt` — when the admin approved the result and the certificate was generated. The gap between these can be days if the admin takes time to review.

### 4. `duration` stored as `time.Duration` (int64 nanoseconds)

Go's `time.Duration` is an `int64` representing nanoseconds. GORM stores it as a `bigint`. Business logic multiplies by `time.Minute` before use:

```go
dd := registration.Exam.Duration * time.Minute
endTime := startTime.Add(dd)
```

This means the `duration` column stores minutes as a raw integer, which is then interpreted correctly by the Go application.

### 5. No soft-delete

Records are hard-deleted. Deleting a question cascade-deletes its options. Deleting an exam does not automatically cascade-delete registrations — this is a known limitation.
