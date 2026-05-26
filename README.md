# IN – TUG Cards

A web application for viewing and building team profile cards based on workplace assessments (Working Genius, Kolbe, Principle You, and Values). Built as a monorepo containing a Next.js web app and a Sanity.io content studio.

---

## Table of Contents

- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture Overview](#architecture-overview)
- [Key Integrations](#key-integrations)
- [API Routes](#api-routes)
- [Auth0 Setup](#auth0-setup)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Code Conventions](#code-conventions)

---

## Monorepo Structure

```
/
├── nextapp/          # Next.js 16 web application (App Router)
├── sanitycms/        # Sanity.io v5 content studio
├── auth0-hooks/      # Auth0 post-registration action (deployed manually to Auth0)
└── package.json      # Root workspace config (npm workspaces)
```

Dependencies are managed at the workspace level. Always run `npm install` from the **root** of the repo.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 3.4, Radix UI, shadcn/ui |
| CMS | Sanity.io v5 |
| Auth | Auth0 (`@auth0/nextjs-auth0` v4) |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| PDF generation | Puppeteer Core + `@sparticuz/chromium` |
| Analytics | PostHog |
| Feature flags | Statsig |
| Forms | React Hook Form + Zod |
| Tables | TanStack React Table |
| Hosting | Vercel |

---

## Prerequisites

- **Node.js 22.x** (enforced via `engines` in `package.json`)
- **npm 10+**
- Access to the following external services (obtain credentials from the project owner):
  - [Auth0](https://auth0.com) — authentication
  - [Sanity.io](https://sanity.io) — content / data (Project ID: `8hl62j77`)
  - [PostHog](https://posthog.com) — analytics
  - [Statsig](https://statsig.com) — feature flags
  - [Anthropic](https://console.anthropic.com) — Claude AI (PDF auto-populate)
  - [Vercel](https://vercel.com) — deployment

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd nextjs-inspire-network-baseball-cards
npm install
```

### 2. Set up environment variables

Copy the example below into `nextapp/.env.local` and fill in all values (see [Environment Variables](#environment-variables)):

```bash
cp nextapp/.env.example nextapp/.env.local   # if an example file exists, otherwise create it manually
```

### 3. Run the development servers

Run both the Next.js app and Sanity Studio in parallel from the root:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:nextapp    # http://localhost:3000
npm run dev:sanitycms  # http://localhost:3333
```

### 4. Build before pushing

Always verify the production build passes before opening a PR:

```bash
npm run build:nextapp
```

---

## Environment Variables

All variables live in `nextapp/.env.local`. Never commit this file.

### Auth0

| Variable | Description |
|---|---|
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `AUTH0_SECRET` | Long random string used to encrypt the session cookie (generate with `openssl rand -hex 32`) |
| `AUTH0_BASE_URL` | Base URL of the app, e.g. `http://localhost:3000` |
| `AUTH0_ISSUER_BASE_URL` | Your Auth0 tenant URL, e.g. `https://your-tenant.auth0.com` |

### Sanity

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (`8hl62j77`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (`production`) |
| `SANITY_API_TOKEN` | Read-only Sanity API token |
| `SANITY_API_WRITE_TOKEN` | Read-write Sanity API token (used for mutations from the app) |

### PostHog

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL (e.g. `https://app.posthog.com`) |

### Statsig

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | Statsig client SDK key for feature flag evaluation |

### Anthropic

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude (used by the PDF auto-populate feature) |

### App

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ENVIRONMENT` | `development` or `production` |
| `BASE_URL` | Full base URL of the app (used internally for PDF generation requests, e.g. `http://localhost:3000`) |
| `CRON_SECRET` | Secret token to authenticate the Vercel cron job hitting `/api/cron/track-metrics` |
| `CHROME_EXECUTABLE_PATH` | Local Chrome/Chromium binary path for Puppeteer in development (not needed in production) |

---

## Architecture Overview

```
Browser
  │
  ▼
Next.js App (nextapp/)
  ├── (app)/          Protected routes — requires Auth0 session
  └── (constraint)/   Public routes — no auth required
  │
  ├── API Routes (/api/...)
  │     ├── Reads/writes data via Sanity client (GROQ queries)
  │     ├── Generates PDFs via Puppeteer
  │     └── Triggers Claude AI for PDF extraction
  │
  └── Sanity Client
        └── Sanity.io (cloud) — stores all application data
              (profiles, teams, companies, users)

Auth flow:
  User signs in via Auth0
    → Auth0 fires post-registration action (auth0-hooks/)
    → POST /api/auth/sync-user
    → User document created/updated in Sanity with email, Auth0 ID, and permission level
    → All subsequent requests validate via auth0.getSession()
```

### Permission Model

Permissions are stored on the Sanity `user` document:

| Level | Access |
|---|---|
| `user` | Default; can only see their own teams and profiles |
| `admin` | Full access to all teams and profiles |

Permission checks live in `nextapp/src/lib/auth/permissions.ts`.

---

## Key Integrations

### Sanity CMS

All application data lives in Sanity. The schemas are defined in `sanitycms/schemaTypes/`:

- **`profile`** — Assessment data (Working Genius, Kolbe Strengths, Principle You archetypes, Values), plus avatar, job role, team references, and attached PDF files
- **`team`** — Team name, slug, logos, company reference, and group type (client / EGF / prospect)
- **`company`** — Referenced by teams
- **`user`** — Auth0 ID, email, permission level, linked profile and team references

The Next.js app has two Sanity clients (`nextapp/src/lib/sanity/client.ts`):
- **Read client** — uses `SANITY_API_TOKEN`; for fetching data
- **Write client** — uses `SANITY_API_WRITE_TOKEN`; for mutations (user sync, auto-populate)

Queries use ISR with a 30-second revalidation window.

### PostHog Analytics

PostHog is initialised both client-side (`PostHogProvider` in the root layout) and server-side (`nextapp/src/lib/posthog/`). Key events:

| Event | Trigger |
|---|---|
| `user_signed_up` | New Auth0 registration synced to Sanity |
| `team_app_usage` | User visits the app (attributed to their team group) |
| `daily_metrics_snapshot` | Vercel cron job at midnight UTC |

### Statsig Feature Flags

Feature gates are evaluated via `DynamicStatsigProvider`. User eligibility is based on their permission level. The service wrapper is at `nextapp/src/lib/data/services/`.

### Claude AI (Auto-Populate)

The Sanity Studio includes a custom action that sends an uploaded assessment PDF to `POST /api/cms/auto-populate`. The API route passes the PDF to Claude, which extracts structured assessment values and writes them back to the Sanity profile document via mutations. Extraction schemas are in `nextapp/src/lib/sanity/ai/`.

### PDF Generation

TUG card and deck builder PDFs are generated server-side using Puppeteer with a serverless-compatible Chromium binary (`@sparticuz/chromium`). These routes run on the Node.js runtime with a 60 s max duration. Multiple PDFs are merged using `pdf-lib`.

---

## API Routes

All routes are internal (consumed by the frontend only) and live under `nextapp/src/app/api/`.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/sync-user` | Auth0 post-registration webhook → creates/updates Sanity user |
| `GET/POST` | `/api/cms/profiles` | All profiles (auth-filtered) |
| `GET` | `/api/cms/profiles/[uuid]` | Single profile by UUID |
| `GET` | `/api/cms/profiles/grouped` | Profiles grouped by team |
| `GET` | `/api/cms/profiles/batch` | Batch fetch multiple profiles |
| `GET` | `/api/cms/profiles/my-teams` | Profiles on the current user's teams |
| `GET` | `/api/cms/profiles/user-teams` | All teammates of the current user |
| `GET` | `/api/cms/profiles/team/[teamId]` | Profiles belonging to a specific team |
| `GET` | `/api/cms/profiles/team-profiles/[slug]` | Team profiles by team slug |
| `GET` | `/api/cms/profiles/teammates/[excludedUuid]` | All profiles excluding a given UUID |
| `GET/POST` | `/api/cms/teams` | All teams |
| `GET` | `/api/cms/teams/[slug]` | Team by slug |
| `GET` | `/api/cms/teams/all` | All teams (unfiltered) |
| `GET` | `/api/cms/teams/for-user` | Teams for the current user |
| `GET` | `/api/cms/teams/user/[email]` | Teams associated with a given email |
| `POST` | `/api/cms/auto-populate` | AI-powered extraction from a PDF into a Sanity profile |
| `GET` | `/api/tugcards/[uuid]/pdf` | Generate a TUG card PDF for a profile |
| `GET` | `/api/deckbuilder/[type]/pdf` | Generate a comparison PDF for a deck builder type |
| `GET` | `/api/deckbuilder/all/pdf` | Generate a merged PDF of all deck builder types |
| `GET` | `/api/cron/track-metrics` | Daily metrics snapshot (called by Vercel cron) |

---

## Auth0 Setup

The `auth0-hooks/post-user-registration-hook.js` file contains an **Auth0 Action** that must be manually deployed to your Auth0 tenant:

1. In the Auth0 dashboard go to **Actions → Library → Create Action**
2. Select the **Post User Registration** trigger
3. Paste the contents of `auth0-hooks/post-user-registration-hook.js`
4. Add the following **secrets** to the action:
   - `APP_URL` — your app's base URL (e.g. `https://your-app.vercel.app`)
   - `AUTH0_SECRET` — must match the `AUTH0_SECRET` env var in your Next.js app
5. Deploy and attach the action to the **Post User Registration** flow

Without this action, new users will be able to sign in but will not have a Sanity user document created, which will break permission checks throughout the app.

---

## Scripts

Run all scripts from the **repo root** unless noted otherwise.

| Script | Description |
|---|---|
| `npm run dev` | Run Next.js + Sanity Studio in parallel |
| `npm run dev:nextapp` | Run Next.js app only (`http://localhost:3000`) |
| `npm run dev:sanitycms` | Run Sanity Studio only (`http://localhost:3333`) |
| `npm run build:nextapp` | Production build of the Next.js app |
| `npm run build:sanitycms` | Build the Sanity Studio |
| `npm run deploy:sanitycms` | Deploy the Sanity Studio to Sanity's hosted studio |
| `npm run lint` | Lint both packages |
| `npm run lint:nextapp` | Lint the Next.js app only |
| `npm run lint:sanitycms` | Lint the Sanity Studio only |

---

## Deployment

The app is deployed on **Vercel** via automatic git integration — pushing to the main branch triggers a production deployment. There is no manual deployment step for the Next.js app.

To deploy the Sanity Studio:

```bash
npm run deploy:sanitycms
```

### Cron Job

A Vercel cron job is configured in `nextapp/vercel.json` to call `GET /api/cron/track-metrics` daily at midnight UTC. The `CRON_SECRET` environment variable must be set in Vercel for this to authenticate correctly.

### Environment Variables in Vercel

All variables listed in the [Environment Variables](#environment-variables) section must be added to the Vercel project settings under **Settings → Environment Variables**.

---

## Code Conventions

- **File and directory names:** kebab-case (`my-component.tsx`, `my-feature/`)
- **Feature organisation:** business logic, components, hooks, types, and utils are co-located inside `nextapp/src/features/<feature-name>/`
- **Shared code:** reusable components and utilities live in `nextapp/src/shared/`
- **External service wrappers:** clients for Auth0, Sanity, PostHog, etc. live in `nextapp/src/lib/`
- **TypeScript:** strict mode is enabled; shared entity types live in `nextapp/src/shared/entities/`
- **Styling:** Tailwind utility classes only; avoid inline styles
- **Validation:** use Zod schemas for all form inputs and API payloads
