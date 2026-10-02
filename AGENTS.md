# Repository agent instructions

TUG Cards: an npm-workspaces monorepo with a Next.js 16 app (App Router, React 19, strict TypeScript), a Sanity v5 studio that holds all application data, and an Auth0 post-registration action. See `README.md` for product context, env vars, and deployment.

## Working principles

- Act as a critical engineering partner, not a yes-man. Challenge weak ideas and back suggestions with evidence.
- Be concise.
- Reuse existing patterns before inventing new ones. Check the code below for a precedent and link to it when proposing changes.
- Comment sparingly, and only to explain _why_ something exists.
- Challenge new dependencies. Prefer a small amount of local code over a new package.

## Layout

| Path | Owns |
| --- | --- |
| `nextapp/src/app/` | Routes. `(app)/` requires an Auth0 session; `(constraint)/` is public; `api/` holds route handlers |
| `nextapp/src/features/<feature>/` | Feature-local components, hooks, entities, and utils (`browse`, `deck-builder`, `profile`, `profile-pdf`) |
| `nextapp/src/shared/` | Reusable components, assets, and entity types (`shared/entities/`) |
| `nextapp/src/lib/` | External-service wrappers and server data access: `auth0.ts`, `auth/`, `sanity/`, `data/queries/`, `posthog/`, `feature-flags/` |
| `nextapp/src/components/` | `shadcn-ui/` primitives, `custom-ui/`, `layout/` |
| `nextapp/src/tests/integration/` | Route-handler integration tests and `harness.ts` |
| `sanitycms/schemaTypes/` | Sanity document schemas, the source of truth for data shape |
| `auth0-hooks/` | Post-registration action, deployed manually to Auth0 |
| `docs/` | Design notes for non-obvious flows, e.g. `docs/deckbuilder-selections.md` |

## Conventions

- Use kebab-case for file and directory names. Import via `@/src/...` or `@/public/...`.
- Use Tailwind utility classes only. Build on Radix and shadcn/ui primitives. Use `react-icons/go` for icons.
- Validate every form input and API payload with Zod.
- Route handlers stay thin: parse and validate the request, authorize, call `lib/data/queries/*`, and return `NextResponse.json`. Return a public `{ error }` body with the matching status (400/401/403/404/500). See `nextapp/src/app/api/cms/teams/route.ts`.
- Authorization goes through `nextapp/src/lib/auth/permissions.ts` (`requireAuthenticatedUser`, `getAuthorizedUser`, `createAuthorizationContext`, `canAccess*`). Never inline permission checks in a route or component.
- Paginated endpoints use cursors via `nextapp/src/lib/data/pagination.ts`.
- Changing the shape of a Sanity document means updating `sanitycms/schemaTypes/` and the matching types in `shared/entities/` together. Add a migration under `sanitycms/migrations/` when existing documents need it.
- For a major change or a non-obvious flow, add or update a note in `docs/` and link to it from here.

## Commands

Run `npm install` from the repo root only.

| Task | Command |
| --- | --- |
| Dev (app + studio) | `npm run dev` |
| Lint the Next app | `npm run lint:nextapp` |
| Integration tests | `npm run test:integration --workspace=nextapp` |
| Single test file | `cd nextapp && node --import tsx --test --experimental-test-module-mocks src/tests/integration/<name>.integration.test.ts` |
| Build the app | `npm run build:nextapp` |

Known gaps:

- `sanitycms` has no `lint` script, so root `npm run lint` fails. Use `lint:nextapp`.
- There is no typecheck script. `tsc --noEmit` fails without the generated `next-env.d.ts`, so use `npm run build:nextapp` to check types.

Do not read, print, or commit `.env` files or other secrets; use `.env.example` and `README.md` for variable names.

Do not run `deploy:sanitycms`, Sanity GraphQL deploys, or anything that touches production Sanity, Auth0, or Vercel unless explicitly asked.

## Definition of done

1. Lint passes for the files you changed.
2. The relevant integration test file passes, then the full integration suite once.
3. New or changed API routes have integration tests per `TESTING.md`.
4. Your report lists the commands you ran and their results.

## Git workflow

- Use a dedicated Git worktree for implementation work when the primary checkout has unrelated changes.
- Name ticket branches with the Linear ticket identifier first, for example `IN-25-test-harness`.
- Do not use the `codex/` branch prefix in this repository.
- Keep unrelated dependency upgrades or changes from other agents out of ticket commits.

## Testing work

- Follow `TESTING.md`: prefer direct route-handler integration tests with fakes at external boundaries (Auth0, Sanity, Anthropic, PostHog, Chromium).
- Do not mock internal helpers such as `getAuthorizedUser` or query functions. Arrange fixtures so the real logic produces the outcome.
- Do not add browser end-to-end tests or business-logic unit tests unless a ticket explicitly changes that scope.
- For the Next app integration suite, run `npm run test:integration --workspace=nextapp`.
