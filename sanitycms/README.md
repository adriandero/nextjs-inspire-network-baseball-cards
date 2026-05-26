# sanitycms

The [Sanity.io](https://sanity.io) content studio for IN – TUG Cards. This is where all application data (profiles, teams, companies, and users) is managed.

> For repo-wide setup and environment variables see the [root README](../README.md).

- **Project ID:** `8hl62j77`
- **Dataset:** `production`
- **Hosted studio:** managed via `npm run deploy:sanitycms`

---

## Table of Contents

- [Local Development](#local-development)
- [Schema Overview](#schema-overview)
- [Adding or Modifying a Schema](#adding-or-modifying-a-schema)
- [Auto-Populate Feature](#auto-populate-feature)
- [Custom Components](#custom-components)
- [Desk Structure](#desk-structure)
- [Deploying the Studio](#deploying-the-studio)
- [Querying Data (GROQ)](#querying-data-groq)

---

## Local Development

```bash
# From the repo root
npm run dev:sanitycms
```

Studio runs at `http://localhost:3333`.

You will need a Sanity account with access to the `8hl62j77` project. Ask the project owner to add you as a member in the [Sanity management console](https://sanity.io/manage).

---

## Schema Overview

Schemas are defined in `schemaTypes/` and registered in `schemaTypes/index.ts`.

| Schema | File | Description |
|---|---|---|
| `profile` | `profileType.ts` | A person's TUG card — stores name, job role, avatar, assessment results, PDF files, and team references |
| `team` | `teamType.ts` | A team — name, slug, logo, company reference, and group type (client / EGF / prospect) |
| `company` | `companyType.ts` | A company — referenced by teams |
| `user` | `authTypes.ts` | An authenticated user — stores Auth0 ID, email, permission level (`user` / `admin`), and references to their profile and teams |

### Profile assessments

The `profile` schema stores results for four assessments:

| Assessment | Fields |
|---|---|
| **Working Genius** | Six genius types with widget levels: `wonder`, `invention`, `discernment`, `galvanizing`, `enablement`, `tenacity` |
| **Principle You** | 28 archetype options (multi-select) |
| **Kolbe Strengths** | Four scores: `factFinder`, `followThru`, `quickStart`, `implementer` |
| **Values** | Free-form values text |

Assessment PDFs can also be attached directly to a profile document and used to auto-populate the fields above (see [Auto-Populate Feature](#auto-populate-feature)).

---

## Adding or Modifying a Schema

1. Create or edit the schema file in `schemaTypes/`
2. Follow the existing pattern — export a `defineType(...)` object
3. Register the new type in `schemaTypes/index.ts`:
   ```ts
   import { myNewType } from './myNewType';

   export const schemaTypes = [profile, team, company, user, myNewType];
   ```
4. If the new document type needs to appear in the studio sidebar, add it to `deskStructure.ts`
5. If the Next.js app needs to query the new type, add a GROQ query in `nextapp/src/lib/data/queries/`

> Sanity schema changes are **backwards-compatible by default** — adding fields does not break existing documents. Removing or renaming fields requires a data migration if existing documents use them.

---

## Auto-Populate Feature

The studio includes a custom document action on the `profile` type that reads attached assessment PDFs and populates the assessment fields automatically using Claude AI.

**How it works:**

1. Upload one or more assessment PDFs to the profile document's file fields
2. Click the **Auto-Populate** action button in the document editor
3. The studio sends the PDF(s) to `POST /api/cms/auto-populate` in the Next.js app
4. Claude reads the PDFs and returns structured assessment data
5. The action writes the extracted values back to the profile document via Sanity mutations

The Claude extraction schemas (allowed values, field mappings) are defined in `nextapp/src/lib/sanity/ai/`. If assessment formats change, update those schemas.

---

## Custom Components

Custom input components live in `components/`:

| Component | Purpose |
|---|---|
| `ImageCropField` | Custom image field with crop and hotspot support for profile avatars and team logos |

Register custom components in the schema definition using Sanity's `components` field option.

---

## Desk Structure

The studio sidebar layout is configured in `deskStructure.ts` using Sanity's Structure Builder API. Modify this file to:

- Change how document types are grouped or ordered in the sidebar
- Add filtered list views (e.g. "Profiles by team")
- Add custom panes or previews

The structure is registered in `sanity.config.ts` via the `structureTool` plugin.

---

## Deploying the Studio

The hosted Sanity Studio is deployed separately from the Next.js app:

```bash
# From the repo root
npm run deploy:sanitycms
```

This builds the studio and deploys it to Sanity's hosting. The deployed studio URL is managed in the [Sanity management console](https://sanity.io/manage) under the project settings.

> Schema and structure changes only take effect in the hosted studio after running this command.

---

## Querying Data (GROQ)

The studio includes the [Vision plugin](https://www.sanity.io/docs/the-vision-plugin) for running GROQ queries interactively. Access it via the **Vision** tab in the studio sidebar.

GROQ queries used by the Next.js app are stored in `nextapp/src/lib/data/queries/`. Refer to those as a reference when writing new queries.

Useful GROQ references:
- [GROQ cheat sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Sanity GROQ documentation](https://www.sanity.io/docs/groq)
