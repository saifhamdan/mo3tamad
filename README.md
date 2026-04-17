# MO3TAMAD — Certified Assessments Platform

> **Academic project** — B.Sc. Graduation Project, King Abdullah II School of Information Technology, University of Jordan, 2023.
> Supervisors: Dr. Bilal Abu Salih · Dr. Reem Alfayez · Dr. Saleh Sharaeh

![Go](https://img.shields.io/badge/Go-1.20-00ADD8?logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-6-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## What is MO3TAMAD?

MO3TAMAD (Arabic: مُعتمَد, "Accredited") is a full-stack web platform for conducting **tamper-resistant online certification exams** and issuing **verifiable digital certificates**.

Traditional online certifications are easy to fake — courses can be copied, exams can be cheated. MO3TAMAD addresses this by:

- Enforcing a **proctored exam environment** (fullscreen lock, cheat detection signals)
- Using an **adaptive exam flow** where companies control the question bank
- Requiring **explicit admin approval** before a certificate is issued, separating automated grading from credentialing
- Generating **PDF/PNG certificates** with short, non-guessable URLs as proof of achievement

Companies create and publish exams. Users register, take the timed exam, and — if they pass and the company approves — receive a downloadable certificate via email.

---

## Key Features

- **Role-based access control** — three roles (admin/company, assistant, user) with fine-grained Casbin policies manageable via API
- **Exam lifecycle state machine** — `waiting-approval → not-started → started → passed / not-passed / cheated`
- **Real-time exam timer** — server-side `EndTime` enforcement; client displays countdown
- **Per-question transaction tracking** — each answer is a separate atomic write; grading is deterministic
- **Anti-cheat signals** — client reports tab/window switches; admin sees cheat flag per applicant
- **Certificate generation pipeline** — HTML template → `wkhtmltopdf` PDF → `pdftoppm` PNG, served at a short UUID URL
- **Email notifications** — approval and decline emails with certificate link (SMTP)
- **Company dashboard** — full CRUD for exams, questions, and assistant users; applicant review queue
- **Rich text questions** — WYSIWYG editor (React Draft) for question content; options support markup
- **Redis session store** — opaque tokens with instant revocation on logout; no JWT

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend language | Go | 1.20 |
| HTTP framework | Fiber | v2.42 |
| ORM | GORM | v1.24 |
| Authorization | Casbin (`CachedEnforcer`) | v2 |
| Password hashing | bcrypt | — |
| PDF generation | wkhtmltopdf + pdftoppm | — |
| Image processing | disintegration/imaging (WebP) | — |
| Logging | Uber Zap + Lumberjack | — |
| Config | Viper | — |
| Frontend framework | React | 18.2 |
| Language | TypeScript | 4.9 |
| UI library | Material UI (MUI) | v5 |
| State management | Redux Toolkit + React Context | — |
| HTTP client | Axios | — |
| Forms | Formik + Yup | — |
| Rich text editor | React Draft WYSIWYG | — |
| Database | MySQL | 8.0 |
| Cache / Sessions | Redis | 6 |
| Containerization | Docker Compose | — |

---

## System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    React SPA (port 3000)                  │
│  User/Exam-taker    Company Admin    Assistant            │
└──────────────────────────┬───────────────────────────────┘
                           │  HTTPS / REST JSON
┌──────────────────────────▼───────────────────────────────┐
│               Go Fiber API Server (port 5000)             │
│                                                           │
│  RequestsLogger → CORS → Protect → Authorization → Handler│
│       ↑                    ↑              ↑               │
│    Zap log             Redis token    Casbin RBAC          │
└──────┬───────────────────────────────────────────────────┘
       │
  ┌────┴──────────────────────────────┐
  │                                   │
┌─▼──────┐  ┌────────┐  ┌──────────────────────┐
│ MySQL  │  │ Redis  │  │ wkhtmltopdf + pdftoppm│
│  8.0   │  │   6    │  │  (certificate gen)    │
└────────┘  └────────┘  └──────────────────────┘
```

---

## Exam Lifecycle

```
              Register
                 │
    ┌────────────▼────────────┐
    │     waiting-approval    │ ← company must approve enrollment
    └────────────┬────────────┘
                 │  Admin approves
    ┌────────────▼────────────┐
    │       not-started       │
    └────────────┬────────────┘
                 │  User clicks Start (server records StartTime + EndTime)
    ┌────────────▼────────────┐
    │         started         │ ← timer running; answers submitted per-question
    └────┬───────────┬────────┘
         │           │
  Cheat  │           │ Finish (or timer expires)
detected │    ┌──────▼──────────┐
         │    │  Auto-graded    │ (score = correct / total × 100)
         │    │  Passed / Not-  │
         │    │  Passed         │
         │    └──────┬──────────┘
    ┌────▼────┐      │  Admin reviews + approves
    │ cheated │      │
    └─────────┘  ┌───▼────────────────────┐
                 │ Certificate generated  │
                 │ Email sent to user     │
                 └────────────────────────┘
```

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [wkhtmltopdf](https://wkhtmltopdf.org/) and `poppler-utils` (for `pdftoppm`) — required on the host or baked into the backend Docker image

### 1. Clone the repo

```bash
git clone <repo-url>
cd mo3tamad
```

### 2. Configure environment

```bash
cp backend/app.env.example backend/app.env
# Edit backend/app.env with your SMTP credentials if you want email to work
```

### 3. Build and run with Docker Compose

```bash
docker build -t mo3tamad-backend ./backend
docker build -t mo3tamad-frontend ./frontend
docker compose up -d
```

The API is available at `http://localhost:5000` and the frontend at `http://localhost:3000`.

### 4. Seed initial data

The backend auto-migrates the database schema on startup using GORM. Seed data for categories and levels is in `backend/data/`.

---

## Project Structure

```
mo3tamad/
├── backend/               # Go API server
│   ├── app/               # Application bootstrap (DI wiring)
│   ├── cmd/               # Entry point (main.go)
│   ├── config/            # Viper config struct
│   ├── data/              # Seed data (categories, levels)
│   ├── internal/
│   │   ├── middleware/    # Auth, authz, logging middleware
│   │   └── server/        # HTTP handlers (one file per resource)
│   ├── model/             # GORM model structs
│   └── pkg/               # Reusable packages
│       ├── authz/         # Casbin enforcer + policy management
│       ├── cache/         # Redis wrapper
│       ├── certificate/   # PDF/PNG certificate generator
│       ├── db/            # MySQL connection
│       ├── email/         # SMTP email sender
│       ├── http/          # App-level HTTP helpers
│       ├── logger/        # Zap logger setup
│       ├── oauth2/        # Token issuance + introspection
│       ├── redis/         # Redis client factory
│       └── shortuuid/     # Custom base57 UUID generator
├── frontend/              # React TypeScript SPA
│   ├── src/
│   │   ├── @types/        # TypeScript type declarations
│   │   ├── atoms/         # Low-level UI components
│   │   ├── components/    # Feature components (quiz, forms, modals)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Route-level page components
│   │   ├── services/      # Axios API service functions
│   │   ├── store/         # Redux store + auth context
│   │   └── utils/         # Helpers (HTTP mapper, filter, spinner)
│   └── public/
├── docs/                  # Architecture and API documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DATABASE.md
└── docker-compose.yaml
```

---

## Documentation

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, middleware chain, auth model, certificate pipeline |
| [docs/API.md](docs/API.md) | Full REST API reference with all endpoints |
| [docs/DATABASE.md](docs/DATABASE.md) | Database schema, entity relationships, design decisions |
| [backend/README.md](backend/README.md) | Backend setup, config reference, package guide |
| [frontend/README.md](frontend/README.md) | Frontend setup, routing, role-based UI |

---

## Academic Context

This project was developed as a B.Sc. graduation project at the **University of Jordan** (January–June 2023) by:

| Name | Student ID |
|---|---|
| Abdallah Almaharmeh | 0193598 |
| Haroun Salem | 0195706 |
| Saif allah Hamdan | 0198502 |

The full project report — including requirements analysis, UML diagrams, DFD, ERD, system design, heuristic evaluation, and cooperative evaluation — is included in the repository.

The system was designed to address the gap in trusted, affordable IT certification for the Arab job market, inspired by platforms like Duolingo English Test but focused on technical skills.
