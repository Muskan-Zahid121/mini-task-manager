# Mini Task Manager

A compact full-stack task manager built for a technical coding assessment. It demonstrates a reliable, traceable task lifecycle: enforced status transitions, idempotent updates, immutable audit history, and transactional consistency — wrapped in a responsive dark UI.

> Development-only assessment project. No deployment, CI/CD, or automated testing infrastructure by design.

---

## 1. Project Overview

- **Frontend:** React + TypeScript + Vite dashboard for creating tasks, changing status, deleting tasks, and browsing audit history.
- **Demo login screen:** a mock, UI-only login (hardcoded credentials + a localStorage flag) that gates the dashboard. Presentation only — no real authentication, per the assessment's no-auth scope.
- **Backend:** Node.js + Express + TypeScript REST API with clean module separation (routes → controllers → services → models).
- **Database:** PostgreSQL with Sequelize ORM and Sequelize CLI migrations.

## 2. Core Problem

The core problem is maintaining a **reliable and traceable task lifecycle**. The application must ensure:

- only valid status transitions happen,
- every valid status change is recorded exactly once,
- repeated same-status requests are idempotent (no duplicate audit logs),
- task status and audit history remain synchronized (single transaction),
- audit records cannot be modified through the API (append-only).

## 3. Technology Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, Lucide React, Axios, Sonner (toasts) |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | PostgreSQL, Sequelize ORM, Sequelize CLI migrations |

## 4. Architecture

```
HTTP request
  → Express app (CORS, JSON parsing)
    → /api router
      → module routes        (URL → controller)
      → module validation    (Zod schemas)
      → module controllers   (HTTP only)
      → module services      (business logic, transactions)
        → Sequelize models   (PostgreSQL)
      → centralized error middleware (consistent JSON errors)
```

- **Controllers** only handle HTTP concerns (parse request, send response).
- **Services** contain all business rules, including the transactional status update.
- **Validation** happens at the boundary with Zod; business rules (transitions, actors) live in services/constants.
- **Error middleware** converts `AppError`/`ZodError` into the uniform `{ success, error }` envelope.

## 5. Folder Structure

```
mini-task-manager/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .sequelizerc
│   ├── scripts/reset-database.ts      # drop → create → migrate → seed
│   └── src/
│       ├── server.ts                  # boot + DB connection
│       ├── app.ts                     # express wiring
│       ├── config/                    # env, sequelize, CLI config
│       ├── constants/                 # actors, statuses
│       ├── migrations/                # create-tasks, create-audit-logs
│       ├── models/                    # Task, AuditLog + associations
│       ├── modules/
│       │   ├── tasks/                 # routes, controller, service, validation, types
│       │   └── audit-logs/            # routes, controller, service, types
│       ├── middleware/                # error, not-found
│       ├── routes/index.ts            # /api router
│       ├── seeders/                   # development seed data
│       └── utils/                     # api-response, app-error, status-transition, async-handler
└── frontend/
    ├── package.json · vite.config.ts · tsconfig.json · tailwind.config.js
    └── src/
        ├── pages/                     # dashboard.tsx + login.tsx (demo login)
        ├── components/
        │   ├── ui/                    # shadcn/ui primitives
        │   ├── layout/                # dashboard shell
        │   ├── dashboard/             # stats cards
        │   └── tasks/                 # table, cards, dialogs, badge, skeleton, empty state
        ├── hooks/use-tasks.ts         # task state + actions
        ├── services/api.ts            # Axios API client
        ├── types/ · constants/ · lib/ # types, transition rules, mock-auth helper
        └── main.tsx · App.tsx (route guards) · index.css
```

## 6. Database Schema

**`tasks`**

| Column | Type | Notes |
| --- | --- | --- |
| id | UUID | PK, default `uuidv4` |
| title | varchar(200) | not null |
| status | enum(`to_do`, `pending`, `in_progress`, `done`) | not null, default `to_do` |
| created_at | timestamptz | indexed |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft-delete, indexed |

Indexes: `status`, `deleted_at`, `created_at`.

**`audit_logs`** (append-only)

| Column | Type | Notes |
| --- | --- | --- |
| id | UUID | PK, default `uuidv4` |
| task_id | UUID | FK → `tasks.id` (cascade), indexed |
| actor | enum(`john.doe`, `jane.doe`, `admin.user`) | not null |
| from_status | enum(task statuses) | not null |
| to_status | enum(task statuses) | not null |
| created_at | timestamptz | indexed |

Indexes: `task_id`, `created_at`. **No `updated_at`** — rows are never modified.

Relations: `Task.hasMany(AuditLog, { foreignKey: "taskId", as: "auditLogs" })`, `AuditLog.belongsTo(Task, { foreignKey: "taskId", as: "task" })`.

## 7. API Documentation

Base URL: `/api`. All responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": "..." }`.

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/api/health` | Health check | 200 |
| GET | `/api/tasks` | All active tasks, newest first (soft-deleted excluded) | 200 |
| GET | `/api/tasks/:id` | Single task | 200 / 404 |
| POST | `/api/tasks` | Create task (`{ "title": "..." }`), starts as `to_do` | 201 |
| PUT | `/api/tasks/:id/status` | Update status (`{ "status": "...", "actor": "..." }`) | 200 |
| DELETE | `/api/tasks/:id` | Soft delete | 200 |
| GET | `/api/tasks/:id/audit-logs` | Audit history, oldest first | 200 |

Status update response:

```json
{
  "success": true,
  "data": {
    "task": { "id": "…", "title": "…", "status": "pending", "createdAt": "…", "updatedAt": "…" },
    "auditLog": { "id": "…", "taskId": "…", "actor": "john.doe", "fromStatus": "to_do", "toStatus": "pending", "createdAt": "…" }
  }
}
```

`auditLog` is `null` when the request was an idempotent no-op.

Error codes: `400` validation/business rule, `404` not found, `500` unexpected.

There are **no public APIs** to create, update, or delete audit logs.

## 8. Status Transition Rules

```
to_do → pending → in_progress → done
```

No other transition is allowed (e.g. `to_do → in_progress`, `pending → done`, `done → pending` are rejected with `400 Invalid status transition from X to Y`).

The single source of truth is `backend/src/utils/status-transition.ts`:

```ts
const STATUS_TRANSITIONS = {
  to_do: ["pending"],
  pending: ["in_progress"],
  in_progress: ["done"],
  done: []
};
```

The **backend always enforces** transitions. The frontend mirrors the same rules only to hide invalid options in the UI (`frontend/src/constants/statuses.ts`); it never sends `fromStatus`.

## 9. Idempotency

If the requested status equals the current status (read from PostgreSQL inside the transaction):

- the API still returns `200 { success: true }`,
- no audit log is created,
- no fields change and `updatedAt` is not touched (the save is skipped entirely),
- the response contains `"auditLog": null`.

Repeated identical requests therefore never produce duplicate audit entries.

## 10. Audit Immutability

- Audit logs are **append-only**: created internally by the service layer during a valid status change.
- No REST endpoint can create, update, or delete audit logs.
- `fromStatus` is always derived from the database row inside the transaction — never accepted from the client.
- The model has no `updatedAt`; migrations create no update path.

## 11. Transaction Handling

`TaskService.updateTaskStatus` wraps the update and audit insert in **one Sequelize transaction**:

1. `SELECT … FOR UPDATE` (row lock) to read the current status
2. no-op / validation as above
3. `task.save()`
4. `AuditLog.create()`
5. commit

If audit creation fails, the task update rolls back; if the update fails, the audit insert never happens. Status and audit history can never drift apart.

## 12. Concurrency Handling

Two simultaneous status-change requests could both read the same stale status and create broken history. The service retrieves the task **inside the transaction with `lock: transaction.LOCK.UPDATE`** (`SELECT … FOR UPDATE` on PostgreSQL), so the second request blocks until the first commits, then re-reads the fresh status — making transitions and idempotency checks race-safe.

A larger production system could additionally use optimistic locking (a `version` column) for multi-row or long-lived edit flows; that is intentionally out of scope here.

## 13. Environment Variables

**`backend/.env`** (see `.env.example`):

```
DATABASE_URL=postgres://user:password@localhost:5432/mini_task_manager
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**`frontend/.env`** (see `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

`.env` files are git-ignored.

## 14. Local Development Setup

Prerequisites: Node.js 18+, PostgreSQL running locally.

```bash
# Backend
cd backend
npm install
cp .env.example .env          # then edit DATABASE_URL
npm run db:migrate            # run migrations
npm run db:seed               # optional seed data
npm run dev                   # http://localhost:5000

# Frontend (second terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

## 15. Sequelize Migrations

Migrations are TypeScript files executed through the `tsx` loader (configured via `.sequelizerc` + `src/config/sequelize-cli.cjs`):

```bash
npm run db:migrate        # apply all pending migrations
npm run db:migrate:undo   # revert the latest migration
npm run db:reset          # drop → create → migrate → seed (scripts/reset-database.ts)
```

`sequelize.sync()` is not used anywhere; the schema is migration-defined only.

## 16. Seed Data

`npm run db:seed` inserts four sample tasks in different statuses — *Prepare project documentation* (`to_do`), *Review client requirements* (`pending`), *Complete API implementation* (`in_progress`), *Update portfolio* (`done`) — plus audit-log entries consistent with each non-initial status, so the audit timeline is demo-ready. The seeder is idempotent per Sequelize's meta table (runs once).

## 17. Assumptions

- No real authentication by design; actors are the three predefined constants validated by Zod on every write. The login screen is a demo-only mock (hardcoded credentials + localStorage flag) that gates the dashboard UI — it adds no server-side auth.
- Soft-deleted tasks keep their audit history readable through `GET /api/tasks/:id/audit-logs` (the audit service looks the task up with `paranoid: false`), while the task never reappears in active lists.
- `title` is trimmed; max length 200 enforced on both frontend and backend.
- Audit-log FK uses `ON DELETE CASCADE` (only reachable via hard deletes, which the app never performs).
- Seed rows include matching audit history so seeded tasks don't violate the "every change is recorded" invariant.

## 18. Trade-offs

- **Soft deletion** preserves audit history and enables restore later, at the cost of an extra `deleted_at` filter/index.
- **Predefined actors** instead of auth: satisfies the assessment scope; real deployments would attach identity middleware.
- **PostgreSQL** chosen for relational integrity (FKs, transactions, row locks); a document store would complicate consistency guarantees.
- **Sequelize** provides mature transactions/paranoid support and CLI migrations; Prisma/Drake-style typed query builders were out of scope per requirements.
- **No Redis**: no caching requirement at this scale.
- **No WebSockets**: the dashboard refetches after each mutation instead of live updates.
- **No automated tests / deployment config**: this is explicitly a development-only assessment; effort was prioritized on correctness of business rules.

## 19. Future Improvements

- Pagination/filtering for task list and audit history.
- Optimistic locking (`version` column) in addition to `SELECT … FOR UPDATE`.
- Task editing (rename), reordering, due dates.
- Request logging and structured error reporting.
- Integration tests around the transition/transaction invariants (excluded here by requirement).

## 20. Assessment Questions

**How do you ensure the audit log cannot be modified?**

Audit logs are append-only by construction:

- They are written in exactly one place — the task service, inside the status-update transaction.
- The API exposes only `GET /api/tasks/:id/audit-logs`; there are no endpoints to create, update, or delete audit logs, and unknown routes return 404.
- `from_status` is never accepted from the client — it is read from the task row inside the transaction.
- The `audit_logs` table has no `updated_at` column and the model exposes no update path.
- Tasks are soft-deleted, so no application flow ever hard-deletes audit rows.

**Which part is riskiest if many users use the system at once?**

The status-update path. Every update opens a transaction and takes `SELECT … FOR UPDATE` on the task row — correct, but hot rows serialize and lock waits grow with contention. Second: `GET /api/tasks` returns all active tasks unpaginated, which degrades as the table grows. Both are acceptable at assessment scale and are listed as future work.

**If this grew into a large system, what would you refactor first, and why?**

The read path and module boundaries. First, pagination/filtering on the list endpoints — unbounded queries are the first thing that fails under real data volume. Then, extract a repository layer under the services so SQL concerns stop leaking into business logic, and add integration tests around the transition/idempotency invariants so future refactors stay safe. Identity would move from hardcoded actors to middleware at the same time.

**Which parts were AI-assisted, and how did you validate them?**

AI helped scaffold boilerplate (Vite/Express configuration, shadcn-style UI primitives, migration skeletons) and sped up UI iteration. The business core — transition rules, the transactional update with row lock, and idempotency — was designed deliberately and validated by: a full API test pass (every valid and invalid transition pair, idempotent repeats, soft-delete behavior, error envelopes and exact messages), browser end-to-end verification of each flow, and checking the generated SQL against Sequelize's documented transaction/locking semantics. Every spec requirement was re-checked against the implementation.