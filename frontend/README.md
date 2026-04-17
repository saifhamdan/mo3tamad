# MO3TAMAD Frontend

React 18 + TypeScript SPA for the MO3TAMAD certified assessments platform.
Built with [MUI v5](https://mui.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [Formik](https://formik.org/), and [Axios](https://axios-http.com/).

See the [root README](../README.md) for a full system overview and the [Architecture doc](../docs/ARCHITECTURE.md) for design details.

---

## Prerequisites

- Node.js 16+
- npm 8+

---

## Configuration

Create a `.env` file in this directory:

```bash
cp .env.example .env   # if example exists, otherwise create manually
```

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend API base URL |

---

## Running Locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. The app proxies API calls to the backend URL defined in `.env`.

## Build for Production

```bash
npm run build
```

Output is in the `build/` directory. A pre-built bundle is committed to the repo in `build/` for convenience.

---

## Make Targets

```bash
make dockerbuild       # build the Docker image
make dockercontainer   # run the container (port 3000)
```

---

## Page & Route Map

| Route | Component | Role |
|---|---|---|
| `/` | `HomePage` | User (exam taker) — exam catalog |
| `/login` | `LoginPage` | Public |
| `/signup` | `SignupPage` | Public — choose Student or Company |
| `/exams/:id` | `ExamPage` | User — exam detail + enroll button |
| `/exams/start/:id` | `StartExamPage` | User — proctored quiz interface with countdown timer |
| `/my-exams` | `MyExamsPage` | User — list of enrolled exams and results |
| `/certificate/:id` | `CertificatePage` | User — view/download earned certificate |
| `/my-profile` | `MyProfilePage` | Any authenticated user |
| `/company/exams-projects` | `ExamsProjectsPage` | Admin / Assistant — exam management dashboard |
| `/company/exams-projects/new` | `NewExamProjectPage` | Admin / Assistant |
| `/company/exams-projects/:id/edit` | `EditExamProjectPage` | Admin / Assistant |
| `/company/exams-projects/:id/questions` | `ExamQuestionsPage` | Admin / Assistant |
| `/company/exams-projects/:id/questions/new` | `NewExamQuestionPage` | Admin / Assistant |
| `/company/exams-projects/:id/questions/:qid/edit` | `EditExamQuestionPage` | Admin / Assistant |
| `/company/exams-projects/:id/applicants` | `ExamApplicantsPage` | Admin / Assistant — approve/decline applicants |
| `/company/users` | Users page | Admin — manage assistant accounts |
| `/company/profile` | Company profile | Admin |

---

## Role-Based Routing

After login the app reads the `policies` object from the `AuthContext` (originally fetched from `GET /api/v1/accounts/policies/ui` and stored in a cookie). The root `index.tsx` redirects based on the user's effective permissions:

```tsx
if (policies.examsGetall) {
    navigate("/company/exams-projects");   // admin or assistant
} else if (policies.registerAll) {
    navigate("/");                          // exam taker
} else {
    navigate("/login");
}
```

Each page is self-protecting: it reads `policies` from context and redirects to `/login` if the required permission is absent. There is no centralized route guard.

---

## State Management

| Concern | Solution |
|---|---|
| Auth (user, token, company, policies) | React Context (`AuthContext`) + `js-cookie` for persistence across refreshes |
| UI (loading spinners, alerts) | Redux Toolkit `ui-slice` |
| Server data | Direct Axios calls in component `useEffect` or via `use-fetch` hook |

### `AuthContext` (`src/store/auth-context.tsx`)

The central source of truth for authentication. Provides:
- `isLoggedIn` — boolean
- `user` — account object
- `token` — Bearer token
- `policies` — flat policy map from backend
- `companyId` — for company-scoped API calls
- `login(token, user, policies, companyId)` — stores to cookies and updates context
- `logout()` — clears cookies and context

### `ui-slice` (`src/store/ui-slice.ts`)

Minimal Redux slice for global UI state (currently: loading indicator toggle used during API calls).

---

## Custom Hooks

### `use-fetch` (`src/hooks/use-fetch.tsx`)

Generic data-fetching hook wrapping Axios. Returns `{ data, isLoading, error, refetch }`. Used throughout the company dashboard tables.

### `use-filter` (`src/hooks/use-filter.tsx`)

Client-side filter hook for arrays. Powers the search/filter on the exam catalog and question list without additional API calls.

---

## Key Components

### Quiz Interface (`src/components/quiz/`)

| Component | Description |
|---|---|
| `StartQuiz` | Entry screen shown before the timer starts; requests fullscreen |
| `QuizController` | Orchestrates question navigation, answer submission, and the countdown timer (`react-timer-hook`) |
| `QuizNavigation` | Sidebar showing question numbers and answered/unanswered status |
| `Question` | Renders a single question (HTML content via `dangerouslySetInnerHTML`) with its options |
| `Options` | Radio-button group for selecting an answer; fires `POST /trans/:id/answer` on selection |
| `FinishQuiz` | Confirmation modal shown when the user clicks End |

### `CheatModal` (`src/components/modals/CheatModal.tsx`)

Displayed when a visibility change event fires (user switches tab or window). Calls `PATCH /registration/:id/cheat` and locks the exam UI.

---

## TypeScript Types (`src/@types/`)

| File | Contents |
|---|---|
| `models.d.ts` | Domain model interfaces: `Account`, `Exam`, `Question`, `Option`, `Registration`, `Trans`, `Company`, `Comment` |
| `auth.d.ts` | Auth context types: `AuthContextObj`, `Policies` |
| `http.d.ts` | Axios response wrapper types |
| `beadcrumb.d.ts` | Breadcrumb item type for the `Breadcrumbs` component |

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
