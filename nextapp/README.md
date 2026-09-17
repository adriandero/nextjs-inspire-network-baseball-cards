# nextapp

The Next.js 16 web application for IN – TUG Cards.

> For repo-wide setup, environment variables, and architecture overview see the [root README](../README.md).

---

## Table of Contents

- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Routing & Layouts](#routing--layouts)
- [Data Fetching & Caching](#data-fetching--caching)
- [Adding a New Feature](#adding-a-new-feature)
- [Adding a New API Route](#adding-a-new-api-route)
- [UI Components](#ui-components)
- [PDF Generation (Local)](#pdf-generation-local)
- [TypeScript Conventions](#typescript-conventions)
- [Code Conventions](#code-conventions)

---

## Local Development

```bash
# From the repo root
npm run dev:nextapp
```

App runs at `http://localhost:3000`.

Before opening a PR, verify the production build passes locally:

```bash
npm run build:nextapp
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router — routes and layouts
│   ├── (app)/                  # Auth-protected routes (requires Auth0 session)
│   ├── (constraint)/           # Public routes (no auth)
│   └── api/                    # API route handlers
│
├── features/                   # Feature modules — co-located business logic
│   └── <feature-name>/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
│
├── shared/                     # Reusable across the whole app
│   ├── components/             # Generic UI components (PostHogProvider, etc.)
│   ├── entities/               # Shared TypeScript types / interfaces
│   └── assets/
│
├── components/                 # Local shadcn/ui component instances
├── hooks/                      # Generic reusable hooks (useDebounce, etc.)
├── types/                      # Global enums and type declarations
│
└── lib/                        # External service wrappers
    ├── auth/                   # Permission helpers (canAccessTeam, etc.)
    ├── auth0.ts                # Auth0 client
    ├── sanity/
    │   ├── client.ts           # Read and write Sanity clients
    │   └── ai/                 # Claude extraction schemas
    ├── data/
    │   ├── queries/            # Sanity GROQ query definitions
    │   └── services/           # Statsig feature flag service
    ├── posthog/                # Server-side PostHog client
    └── utils/                  # Puppeteer, PDF helpers, misc utilities

public/
├── images/                     # PNGs, JPGs, photos
├── icons/                      # SVG icons
├── illustrations/              # Vector art, graphics
├── json/                       # Static JSON (mock data, configs)
├── fonts/                      # Custom font files (prefer next/font where possible)
└── docs/                       # PDFs and static documents
```

---

## Routing & Layouts

The app uses two top-level route groups:

| Group | Path | Auth required | Description |
|---|---|---|---|
| `(app)` | `/` and most routes | ✅ Yes | Main application; layout checks `auth0.getSession()` |
| `(constraint)` | `/login`, error pages, etc. | ❌ No | Public-facing pages |

Auth is checked at the layout level via `auth0.getSession()`. API routes use `getAuthorizedUser()` from `src/lib/auth/permissions.ts`, which also enforces team/profile-level access control.

---

## Data Fetching & Caching

- All application data comes from **Sanity** via GROQ queries defined in `src/lib/data/queries/`.
- Server components fetch directly using the Sanity read client (`src/lib/sanity/client.ts`).
- Queries use Next.js **ISR** with a 30-second revalidation window:
  ```ts
  const data = await client.fetch(query, params, { next: { revalidate: 30 } });
  ```
- For mutations (writes), use the write client (`writeClient`) — this requires `SANITY_API_WRITE_TOKEN`.
- Prefer server components for data fetching. Use client components only when interactivity or browser APIs are required.

---

## Adding a New Feature

1. Create a folder under `src/features/<feature-name>/`
2. Co-locate components, hooks, types, and utils inside that folder
3. Add the route under `src/app/(app)/<route>/page.tsx`
4. If the feature needs data from Sanity, add a GROQ query to `src/lib/data/queries/`
5. Shared UI goes in `src/shared/components/`, not inside the feature folder

---

## Adding a New API Route

1. Create `src/app/api/<path>/route.ts`
2. Export named HTTP method handlers (`GET`, `POST`, etc.)
3. Start every protected route with an auth check:
   ```ts
   import { getAuthorizedUser } from '@/lib/auth/permissions';

   export async function GET() {
     const user = await getAuthorizedUser();
     if (!user) return new Response('Unauthorized', { status: 401 });
     // ...
   }
   ```
4. For routes that need Sanity write access, import `writeClient` from `@/lib/sanity/client`
5. For heavy routes (PDF generation, AI calls), add runtime and timeout overrides at the top of the file:
   ```ts
   export const runtime = 'nodejs';
   export const maxDuration = 60;
   ```

---

## UI Components

- **shadcn/ui** components live in `src/components/ui/`. Add new ones via the shadcn CLI:
  ```bash
  npx shadcn@latest add <component>
  ```
- **Radix UI** primitives are used directly where shadcn doesn't cover the use case.
- **`react-icons/go`** (GitHub Octicons) is the primary icon library used throughout the app. **`react-icons/pi`** (Phosphor Icons) is used in a few places. Lucide React is present but only as an internal dependency of shadcn/ui components — don't use it directly for new app icons.
- Fonts are loaded via `next/font` (Geist). Do not add font files manually unless absolutely necessary.

---

## PDF Generation (Local)

PDF routes use Puppeteer with a serverless Chromium binary in production. For local development you need to point to your system Chrome:

1. Find your Chrome path (e.g. `/usr/bin/google-chrome` or `/Applications/Google Chrome.app/...`)
2. Add it to `nextapp/.env.local`:
   ```
   CHROME_EXECUTABLE_PATH=/path/to/chrome
   ```

The PDF routes also depend on `BASE_URL` being set so they can fetch the rendered page internally:
```
BASE_URL=http://localhost:3000
```

---

## TypeScript Conventions

- Strict mode is enabled — no implicit `any`.
- Shared entity types (profile, team, user, etc.) live in `src/shared/entities/`.
- Use Zod schemas for validating API inputs and external data (including Claude AI extraction output).
- Path alias `@/` maps to `src/` — use it everywhere instead of relative imports that cross directory boundaries.

---

## Code Conventions

- **File and directory names:** kebab-case (`my-component.tsx`, `my-feature/`)
- **Components:** PascalCase named exports
- **Hooks:** camelCase prefixed with `use`
- **Styling:** Tailwind utility classes only; no inline styles, no CSS modules
- **Validation:** Zod for all external data and form inputs
- **Commits:** run `npm run build:nextapp` before pushing to catch type/build errors early
