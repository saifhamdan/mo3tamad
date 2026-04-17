# API Reference

Base URL: `http://localhost:5000`

All `/api/v1/...` routes require authentication via `Authorization: Bearer <access_token>` unless stated otherwise. Routes that require a specific Casbin policy are marked in the **Auth** column.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Accounts](#accounts)
3. [Exams](#exams)
4. [Questions](#questions)
5. [Registration](#registration)
6. [Transactions (Answers)](#transactions-answers)
7. [Company](#company)
8. [Comments](#comments)
9. [Categories & Levels](#categories--levels)
10. [System (Admin)](#system-admin)
11. [Static Files](#static-files)

---

## Authentication

These routes are outside the `/api` group and require no token.

### POST `/auth/oauth/login`

Authenticate a user and issue tokens.

**Request headers**
```
Authorization: Basic base64(email:password)
```

**Response `200`**
```json
{
  "access_token": "abcd1234",
  "refresh_token": "efgh5678",
  "scope": "user",
  "expires_in": 3600
}
```

---

### POST `/auth/oauth/signup`

Register a new user account.

**Request body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret",
  "mobile": "0791234567"
}
```

**Response `201`** — created account object.

---

### POST `/auth/oauth/signup/company`

Register a new company account (admin role).

**Request body**
```json
{
  "name": "Oracle Jordan",
  "email": "admin@oracle.com",
  "password": "secret",
  "mobile": "0791234567",
  "desc": "Technology company"
}
```

---

### DELETE `/auth/oauth/logout/:session_id`

Revoke the current session. Deletes token from Redis and MySQL.

**Auth**: Bearer token required.

---

### POST `/auth/oauth/refresh/token`

Exchange a refresh token for a new token pair.

**Request body**
```json
{ "refresh_token": "efgh5678" }
```

**Response `200`** — new `access_token` + `refresh_token`.

---

## Accounts

### GET `/api/v1/accounts/`

List all accounts. **Auth**: `admin` policy.

### GET `/api/v1/accounts/company/:companyId`

List accounts belonging to a company. **Auth**: `users.getall` policy.

### GET `/api/v1/accounts/me`

Return the authenticated user's profile. **Auth**: any authenticated user.

### PATCH `/api/v1/accounts/me`

Update the authenticated user's own profile (name, mobile). **Auth**: any authenticated user.

**Request body**
```json
{ "name": "New Name", "mobile": "0799999999" }
```

### GET `/api/v1/accounts/policies/ui`

Return a flat map of the authenticated user's effective Casbin permissions, formatted for frontend consumption.

**Response `200`**
```json
{
  "examsCreate": true,
  "examsDelete": true,
  "registerAll": false
}
```

### GET `/api/v1/accounts/:id`

Get account by ID. **Auth**: `users.get` policy.

### POST `/api/v1/accounts/`

Create a new account (used by admins to create assistants). **Auth**: `users.create` policy.

**Request body**
```json
{
  "name": "Assistant Name",
  "email": "assistant@company.com",
  "password": "secret",
  "role_id": 2
}
```

### DELETE `/api/v1/accounts/:id`

Delete an account. **Auth**: `users.delete` policy.

### PATCH `/api/v1/accounts/:id`

Update an account. **Auth**: `users.update` policy.

---

## Exams

### GET `/api/v1/exams/`

List all published exams. **Auth**: any authenticated user.

**Response `200`** — array of exam objects, each including `Company`, `Categories`, `Level`, and the authenticated user's `Registration` if they have enrolled.

### GET `/api/v1/exams/company/:companyId`

List exams created by a specific company. **Auth**: `exams.getall` policy.

### GET `/api/v1/exams/:id`

Get a single exam by ID. **Auth**: any authenticated user.

### POST `/api/v1/exams/`

Create a new exam. **Auth**: `exams.create` policy.

**Request**: `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `thumbnail` | file | Exam thumbnail image (converted to WebP) |
| `title` | string | Exam title |
| `desc` | string | Description |
| `passing_score` | int | Minimum score to pass (0–100) |
| `duration` | int | Duration in minutes |
| `category_ids` | []int | Associated category IDs |
| `level_id` | int | Difficulty level ID |

### DELETE `/api/v1/exams/:id`

Delete an exam and its questions. **Auth**: `exams.delete` policy.

### PATCH `/api/v1/exams/:id`

Update exam metadata. **Auth**: `exams.update` policy.

---

## Questions

### GET `/api/v1/questions/`

List all questions (across all exams). **Auth**: any authenticated user.

### GET `/api/v1/questions/:id`

Get a single question with its options. **Auth**: any authenticated user.

### GET `/api/v1/questions/byId/:examId`

Get all questions for a specific exam. **Auth**: any authenticated user.

### POST `/api/v1/questions/`

Create a question for an exam. **Auth**: any authenticated user (restricted by company ownership in practice).

**Request body**
```json
{
  "exam_id": 1,
  "text": "<p>What is a goroutine?</p>",
  "options": [
    { "text": "A lightweight thread", "is_correct": true },
    { "text": "A database connection", "is_correct": false },
    { "text": "A package manager", "is_correct": false },
    { "text": "A type assertion", "is_correct": false }
  ]
}
```

### DELETE `/api/v1/questions/:id`

Delete a question and cascade-delete its options. **Auth**: any authenticated user.

### PATCH `/api/v1/questions/:id`

Update a question and replace its options. **Auth**: any authenticated user.

---

## Registration

A Registration represents a user's enrollment in a specific exam.

### GET `/api/v1/registration/my-exams`

List the authenticated user's registrations (all exams they enrolled in). **Auth**: any authenticated user.

### GET `/api/v1/registration/:id`

Get a specific registration. **Auth**: any authenticated user.

### GET `/api/v1/registration/byExam/:examId`

Get all applicants (registrations) for an exam. **Auth**: any authenticated user (company sees all applicants for their exam).

**Response `200`** — array of registration objects each including `Account` and `Trans` count.

### POST `/api/v1/registration/:account_id/:exam_id`

Enroll a user in an exam. Creates the registration and pre-populates one `Trans` record per question. **Auth**: `register.all` policy.

### DELETE `/api/v1/registration/:id`

Cancel a registration. **Auth**: any authenticated user.

### PATCH `/api/v1/registration/:id/start`

Start the exam. Records `StartTime = now` and `EndTime = now + exam.Duration`. The status transitions to `started`. **Auth**: `register.all` policy.

### PATCH `/api/v1/registration/:id/finish`

Submit the exam. Iterates all `Trans` records, checks each selected option's `IsCorrect`, computes `Result = (correct / total) * 100`. Sets `Passed = result >= exam.PassingScore`. **Auth**: `register.all` policy.

### PATCH `/api/v1/registration/:id/cheat`

Flag the registration as cheated. Called by the frontend when a tab-switch or other anti-cheat signal is detected. Sets `IsCheated = true`. **Auth**: `register.all` policy.

### PATCH `/api/v1/registration/:id/approve`

Admin approves a registration. Triggers:
1. Sets `IsConsidered = true`, `Passed = true`, `IssuedAt = now`
2. Generates PDF + PNG certificate via `wkhtmltopdf` / `pdftoppm`
3. Stores certificate at `public/certificates/<shortUUID>.png`
4. Sends approval email with certificate URL to the user

**Auth**: `exams.create` policy (company-level).

### PATCH `/api/v1/registration/:id/decline`

Admin declines a registration. Sends a decline email to the user. **Auth**: `exams.create` policy.

---

## Transactions (Answers)

A `Trans` record represents a user's answer to a single question within a registration.

### POST `/api/v1/trans/:transId/answer`

Submit or update the answer for a question.

**Query parameter**: `?answerId=<optionId>`

**Auth**: `register.all` policy.

This is called once per question as the user navigates through the exam. The `Trans` record for that question is updated with the selected `OptionId`. Submitting again overwrites the previous answer.

---

## Company

### GET `/api/v1/company/`

List all companies. **Auth**: any authenticated user.

### GET `/api/v1/company/:id`

Get a single company. **Auth**: any authenticated user.

### POST `/api/v1/company/`

Create a company. **Auth**: any authenticated user (used internally during company signup).

### DELETE `/api/v1/company/:id`

Delete a company. **Auth**: any authenticated user.

### PATCH `/api/v1/company/:id`

Update company profile. **Auth**: any authenticated user.

---

## Comments

### GET `/api/v1/comment/`

List all comments. **Auth**: any authenticated user.

### POST `/api/v1/comment/`

Create a comment on an exam. **Auth**: any authenticated user.

**Request body**
```json
{
  "exam_id": 1,
  "desc": "Great exam, well structured!"
}
```

### PATCH `/api/v1/comment/:id`

Edit a comment. **Auth**: any authenticated user (owner only, enforced in handler).

### DELETE `/api/v1/comment/:id`

Delete a comment. **Auth**: any authenticated user (owner only, enforced in handler).

---

## Categories & Levels

### GET `/api/v1/category/`

List all exam categories (e.g., Programming, Networking, Databases). **Auth**: any authenticated user.

### GET `/api/v1/level/`

List all difficulty levels. **Auth**: any authenticated user.

---

## System (Admin)

These routes are under `/api/v1/system/` and require the `admin.all` Casbin policy (superuser only).

### Roles

| Method | Path | Description |
|---|---|---|
| `GET` | `/system/roles/` | List all roles |
| `POST` | `/system/roles/` | Create a role |
| `PUT` | `/system/roles/:role_id` | Update a role |
| `DELETE` | `/system/roles/:role_id` | Delete a role |

### Resources

| Method | Path | Description |
|---|---|---|
| `GET` | `/system/resources/` | List all resources |
| `GET` | `/system/resources/:role_id/role` | List resources for a role |
| `POST` | `/system/resources/` | Create a resource |
| `PUT` | `/system/resources/:resource_id` | Update a resource |
| `DELETE` | `/system/resources/:resource_id` | Delete a resource |

### Policies (Casbin)

| Method | Path | Description |
|---|---|---|
| `GET` | `/system/policies/` | List all Casbin policies |
| `GET` | `/system/policies/:role` | Get policies for a role |
| `POST` | `/system/policies/` | Add a policy |
| `PUT` | `/system/policies/` | Update a policy |
| `DELETE` | `/system/policies/` | Remove a policy |

---

## Static Files

These routes serve files directly from the `public/` directory and require no authentication.

### GET `/thumbnails/:thumbnailUrl`

Serve an exam thumbnail image (WebP format).

### GET `/certificates/:certUrl`

Serve a generated certificate image (PNG format). The `:certUrl` is the short UUID generated at approval time.
