# Saved deckbuilder selections

Continue sends group names, group IDs, and selected profile UUIDs to
`POST /api/deckbuilder/selections`. The server validates the selection and the
creator's access, writes an immutable `deckSelection` document in Sanity, and
returns its UUID. Comparison URLs contain only `?selection=<uuid>`.

The selection document contains identifiers and group names, not copies of
profile assessments. Profile data and access permissions are resolved when a
viewer opens the link. Creating another selection does not change earlier links.
Selections do not currently expire; retain the documents while their links are
in use. The existing `SANITY_API_WRITE_TOKEN` must allow creating these documents.

## Flows

- **Continue:** save through POST, then navigate using the short ID. Failed saves
  display an error and leave the groups in the builder.
- **Read/share/refresh:** `GET /api/deckbuilder/selections/[id]` resolves the saved
  groups using the current reader's permissions. Sharing does not grant access.
  Readers see the profiles they can access; a reader with no access gets 403.
- **Switch comparisons:** preserve the selection query parameter. The comparison
  type follows the pathname, including browser Back/Forward navigation.
- **PDFs:** single and combined export endpoints pass the same selection ID to
  the PDF pages. Chromium receives app-scoped session cookies. The renderer waits
  for content, images, and fonts and closes Chromium after success or failure.
- **Legacy links:** existing `groupedProfiles` links remain readable. Exporting
  from a legacy comparison saves a selection first, avoiding a long PDF request.
  Previously oversized URLs can still fail before reaching the app; recreate
  those through the builder to obtain a short link.

Requests allow up to 200 groups and 10,000 total profile entries. Group IDs must
be unique and groups must be nonempty. These are validation limits, not a promise
that Chromium can export 10,000 profiles within the deployment's time limit.

## Automated verification

Use Node 22 and run from the repository root:

```sh
npm run test:integration --workspace=nextapp
node node_modules/typescript/bin/tsc --noEmit --incremental false -p nextapp/tsconfig.json
```

The route suite uses fake Auth0 sessions, an in-memory Sanity boundary, and a
fake Chromium boundary. It checks large selections, persistence, immutable links,
reader access and revoked membership, validation and denied writes, both PDF
endpoints, legacy exports, and error responses. No production services or
credentials are used by these tests. It does not verify real browser layout or
live provider configuration.

## Live release checklist

Run these against an authorized development/preview environment. Record the
result before merging; automated PDF fixtures do not replace these checks.

- [ ] Select a large set that previously hit 431; Continue opens a short URL with
      the correct profiles, group names, and group order.
- [ ] Edit a group name, including punctuation; remove a group and collapse and
      expand another. No nested-button hydration warning appears.
- [ ] Refresh the comparison and open its copied URL in a new tab. Both restore
      the same groups without relying on the first tab's browser storage.
- [ ] Open the link as another permitted user, then as a user without access.
      Access follows the reader's permissions. Sign-in is required for anonymous
      viewers; sharing must not grant additional access.
- [ ] Switch comparison types; use Back/Forward and refresh. The title and table
      match the URL and retain the selection.
- [ ] Download a single PDF. Open it and check names, images, groups, and display
      options; it must contain the comparison rather than a login/error page.
- [ ] Download All Comparisons. Open it and check all seven comparison sections.
- [ ] If the deployment has a function timeout, repeat exports with a realistic
      large selection and record whether generation finishes within that limit.

## Restructure handoff

This change fixes selection transport without starting the project restructure.
The selection service still combines validation, access rules, persistence, and
HTTP error mapping. Split those responsibilities during the agreed migration to
`frontend/`, `backend/`, and `contracts/`, retaining these routes, saved document
formats, permissions, and compatibility behavior.
