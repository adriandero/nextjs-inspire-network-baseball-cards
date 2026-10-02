---
name: pre-mr-review
description: >-
  Review the current branch (or a named branch) against main before opening a PR, the way a critical senior
  engineer on this repo would. Use when the user asks to review their changes, check a branch, do a self-review
  or pre-PR/pre-MR review, asks "is this ready", or "what would a reviewer catch".
---

# Pre-MR review

Review a branch against `origin/main` and report what a critical senior engineer on this repo would catch. The bar is: every change is correct, secure, tested per `TESTING.md`, and looks like it already belonged in this codebase.

**Report only.** Do not edit files, commit, or push. The developer asks for fixes separately.

**Evidence or silence.** Every finding needs one of: a failing check, a documented rule (`AGENTS.md`, `TESTING.md`, `README.md` Code Conventions), an equivalent file that does it differently, or a concrete input that produces wrong behavior. No evidence, no finding. "No issues found" is a valid result. Do not pad the report.

## Step 1. Scope the diff

The target is `origin/<branch>` if the user named a branch, otherwise `HEAD`. The base is always `origin/main`.

```bash
git fetch origin main <branch-if-named>
git diff origin/main...<target> --name-only
git diff origin/main...<target>
git log origin/main..<target> --oneline
```

Review only changes this branch introduces. With no target named, also run `git status --short`. If there are uncommitted changes, ask whether to include them.

Read `AGENTS.md` and `TESTING.md` before reviewing. They are the source of truth. This skill only adds how to apply them.

Build a manifest of every changed file, sorted by path, and work through it in order so no file is skipped:

| # | File | Area | Role | Equivalent |
|---|------|------|------|------------|

- **Area:** `nextapp`, `sanitycms`, `auth0-hooks`, root/config, or docs.
- **Role:** one of route handler, data query, auth, feature component, hook, shared component, entity/type, Sanity schema, migration, integration test, config, or docs.

## Step 2. Find an equivalent for each file

This is the most important step. For each changed source file, find one or two established files in the same role, read both, and compare them.

- Route handlers: `nextapp/src/app/api/cms/profiles/team-profiles/[slug]/route.ts` (authenticated read with team check) and `nextapp/src/app/api/deckbuilder/selections/route.ts` (mutation delegating to `lib/deck-builder/selections.ts`).
- Data access: `nextapp/src/lib/data/queries/*`, with pagination via `nextapp/src/lib/data/pagination.ts`.
- Integration tests: `nextapp/src/tests/integration/*.integration.test.ts` with `harness.ts`.
- Feature UI: the nearest sibling under `nextapp/src/features/<feature>/`.

Record the equivalent in the manifest. If the branch introduces a pattern with no precedent, flag it unless it replaces the old pattern everywhere.

## Step 3. Checks (ask first)

Skip this step if only docs or config changed. Otherwise ask the developer whether to run:

```bash
npm run lint:nextapp
cd nextapp && node --import tsx --test --experimental-test-module-mocks src/tests/integration/<changed-or-relevant>.integration.test.ts
```

Run the full suite (`npm run test:integration --workspace=nextapp`) once only if the focused tests pass. Lint errors in changed files and failing tests are Critical. Do not count lint errors that already exist on main.

## Step 4. Checklist

Apply only the sections relevant to the manifest.

### 4.1 Security and authorization (highest priority)

- Every non-public route authenticates and authorizes through `nextapp/src/lib/auth/permissions.ts` (`getAuthorizedUser`, `requireAuthenticatedUser`, `createAuthorizationContext`, `canAccess*`), or through a feature module that wraps it. Never through an inline `auth0.getSession()` plus hand-rolled checks.
- Check authorization against the target resource, not only "logged in". A regular user must not reach another team's profiles by changing a slug, UUID, email, or ID in the URL or body. Trace the identifier from the request to the query.
- Admin-only behavior is gated by `canAccessAdmin`.
- Responses must not leak more than the caller may see: other users' emails, Auth0 IDs, permission levels, or internal error messages. Return a public `{ error }` body and log the details server-side.
- No secrets, tokens, or `.env` values in code, logs, or client bundles. Server-only clients (Sanity write token, Anthropic, PostHog server) must not be imported into client components.
- New external calls (Anthropic, Chromium/PDF) need input-size limits and a failure path the caller can observe.

### 4.2 Route handlers

- Keep handlers thin: parse, validate, authorize, call `lib/`, respond. Business logic belongs in `lib/` or the feature module.
- Validate every body and query param with Zod (or the module's existing parser) before use. Invalid input returns 400, not 500.
- Status codes match the contract: 400 validation, 401 no session, 403 forbidden, 404 missing, 500 unexpected. Match the equivalent's error-body shape.
- Mutations set `Cache-Control: no-store` where the equivalent does. Reads that must not be cached do too.
- List endpoints use cursor pagination from `lib/data/pagination.ts`, not ad-hoc offset logic.

### 4.3 Data and Sanity

- GROQ lives in `lib/data/queries/*` or the feature's data module, never inline in components or routes.
- GROQ is parameterized (`$param`). No string interpolation of request input.
- A Sanity document shape change updates `sanitycms/schemaTypes/` and `nextapp/src/shared/entities/` together. Existing documents need a migration in `sanitycms/migrations/`, or the reader must tolerate the old shape.
- Multi-document writes that must stay consistent use a transaction.

### 4.4 Tests (per `TESTING.md`)

- New or changed API routes have route-level integration tests that invoke the real handler.
- Protected routes cover an allowed case, an unauthenticated case (401), and an authenticated-but-unauthorized case (403).
- Mutation routes assert the persisted change via `readTestData()`, and assert that denied or invalid requests leave data unchanged.
- No mocking of internal helpers (`getAuthorizedUser`, query functions). Only the boundaries in `harness.ts` are faked.
- No new unit tests for business logic, Playwright, or browser tests unless the ticket scopes them.
- Each test is isolated: it arranges its own data and resets boundaries.

### 4.5 React and UI

- Feature code stays in `features/<feature>/`. Code moves to `shared/` only once a second feature uses it.
- Tailwind classes only, built on existing shadcn/Radix primitives in `components/shadcn-ui/`. Icons from `react-icons/go`.
- `"use client"` only where needed. No server-only imports in client components.
- Effects have correct dependency arrays (`react-hooks/exhaustive-deps`) and no derived state that could be computed during render.
- Loading, empty, and error states are handled where the equivalent handles them.
- New user-facing behavior that is risky or partial sits behind a Statsig flag via `lib/feature-flags/`. The flag-off path must preserve current behavior exactly.

### 4.6 Logic

Look for inverted conditions, unhandled `null` or `undefined` from Sanity, off-by-one errors in pagination or ranges, empty-array and zero cases, and unawaited promises. Flag only when you can name the input that breaks.

### 4.7 Design principles, made concrete

Apply these as checks, not slogans. Do not suggest abstractions the code does not need yet.

| Principle | What to check here |
|---|---|
| Single responsibility | A handler, hook, or component does one job. A route that also builds queries and shapes UI data should delegate to `lib/`. |
| Open/closed and dependency inversion | Code depends on the existing wrappers in `lib/` (Sanity, Auth0, PostHog, flags), not on SDK clients created inline. That keeps the external boundary fakeable. |
| Interface segregation | Props and function signatures take what they use, not whole documents "just in case". |
| DRY | The branch re-implements an existing helper, query, or component. Grep before flagging, and name the existing one. |
| YAGNI / KISS | New interfaces, factories, generics, or config options with a single caller. Flag them as Important. |
| Least surprise | Names match the vocabulary of the equivalent file (`get*` vs `fetch*`, `profile` vs `card`). |

Smells and their fixes: duplication → reuse or extract the existing helper. A long function → split it into named helpers. Feature envy → move the logic to where the data lives. A shallow wrapper → inline it.

### 4.8 Cleanup

- No unused imports, exports, files, or Sanity fields left behind by a rename or removal. Grep the old name.
- No `console.log` debugging, commented-out code, or TODOs without a ticket.
- `package.json` changes are intentional. Each new dependency is justified over a few lines of local code. Lockfile changes match `package.json`.

## Step 5. Verify before reporting

For each candidate finding, re-open the code and confirm it. Quote the line, and name the equivalent or rule, or the concrete input and the wrong outcome. Drop anything you cannot confirm. Downgrade anything that is a preference.

## Step 6. Report

```
## Pre-MR review: <branch>

Checks: <commands run and results, or "not run">

### Critical (must fix)
Security and authorization holes, data loss or corruption, failing lint or tests, broken routes,
missing tests for new or changed routes.

### Important (should fix)
Pattern divergence from the equivalent, missing 401/403/no-mutation cases, unnecessary abstraction,
schema/type drift, flag-off regressions.

### Minor (consider)
Naming, small simplifications.

### Looks good
What correctly follows the established patterns.
```

Each finding is formatted as follows:

- **`path/to/file.ts:42`:** what's wrong, in one sentence.
- **Evidence:** the equivalent file, the rule, or the failing input.
- **Fix:** a brief suggestion. Do not apply it.

Order findings by severity, and within a severity by manifest order. If the branch is clean, say so in one line.
