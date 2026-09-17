# TUG Cards testing strategy

This document is the testing contract for the TUG Cards application. Future testing work should link to this document and follow it without needing to infer a different testing philosophy from an individual ticket.

## Scope and priorities

The primary test type is a route-level, black-box integration test. A test invokes a real Next.js route handler and observes the behavior available to a caller of that route. The test may arrange data and boundary responses, but it must not reach into the route's internal implementation.

The initial testing phase has two explicit exclusions:

- Do not add unit tests for application business logic.
- Do not add browser end-to-end tests. In particular, do not add Playwright or another browser automation framework for this phase.

Testing should concentrate on behavior that matters at the application boundary: authentication, authorization, input handling, response contracts, and durable data changes. A route test is valuable when it would continue to pass after internal methods are renamed, helpers are rearranged, or services are recomposed without changing the route's externally visible behavior.

## What a route-level integration test does

Each test should:

1. Arrange a realistic fixture set for the acting user, target resource, related data, and any required external responses.
2. Invoke the exported Next route handler directly with a realistic `Request` (and route parameters where applicable).
3. Assert the HTTP status and the relevant response headers or body.
4. Assert observable data mutations by reading through the test data boundary after the request, rather than checking that an internal method was called.
5. Clean up or isolate its data so that tests do not depend on execution order.

The test harness should use the same route-handler entry point that Next uses. It should not start a browser, scrape rendered HTML, or bypass the handler by calling a lower-level service. The route handler is the system under test; data stores and third-party systems are test boundaries.

## External boundaries and fakes

External services are replaced only at their external boundary. In this application that includes Auth0, Sanity, Anthropic, PostHog, and Chromium. A fake boundary should provide realistic inputs and outputs, including failures that callers can observe. For example, an Auth0 boundary can return an unauthenticated session or a session for a fixture user; a Sanity boundary can persist fixture documents and return them through the same data-facing interface used by the route.

Acceptable fakes include:

- an Auth0 session boundary that returns a fixture session;
- a Sanity test datastore or adapter that stores fixture teams, profiles, and documents;
- an Anthropic boundary that returns a deterministic model response or provider error;
- a PostHog boundary that records emitted events without sending them to PostHog;
- a Chromium boundary that returns deterministic PDF/rendering output when a route exposes that behavior.

Brittle internal mocks are not acceptable. Do not mock private helpers, internal methods, service call counts, module composition, or the order in which implementation details happen. Do not assert that `canAccessProfile` was called, that a particular query helper was selected, or that an event was emitted exactly once unless that event itself is an externally observable contract. Assert the resulting status, body, and data state instead.

This distinction is intentional: changing an internal method name or splitting one service into two should not require test changes when the route's behavior is unchanged.

## Fixtures

Fixtures are named, minimal, and reusable representations of the domain and its boundaries. They should cover:

- users, including unauthenticated, regular, and administrator users;
- teams, including memberships and teams the acting user cannot access;
- profiles, including ownership and team relationships;
- documents and other persisted Sanity data;
- external responses, including successful and failed Auth0, Anthropic, PostHog, and Chromium interactions.

Prefer fixture builders or seeded records that make the authorization relationship explicit. Each test should state who is acting and why that user is allowed or denied. Never use production credentials, production tokens, production datasets, or live production services. Test configuration must fail safely if production endpoints or credentials are present.

## Required assertion surface

Tests should cover all relevant parts of the public route contract:

- HTTP status, including success, authentication failure, authorization failure, validation failure, not-found, and upstream failure where applicable;
- response body, including its shape, important values, and error payload;
- observable response headers when they are part of the contract;
- observable data mutations, including created, updated, or deleted records and the absence of a mutation after a denied or failed request.

Security coverage must include both allowed and denied behavior. At minimum, protected routes should have an unauthenticated case and an authenticated-but-unauthorized case, alongside an allowed case when the route supports it. Mutation routes must verify that denied requests leave the datastore unchanged.

## Short examples

The following examples describe the required shape. They are intentionally framework-level examples, not a request to add tests in this ticket.

### 1. Protected profile route

For `GET /api/cms/profiles/team-profiles/[slug]`, seed a team and profiles, configure the Auth0 boundary with a fixture user who belongs to that team, and invoke the real route handler with `{ slug: "engineering" }`. Assert `200`, the returned profile JSON, and that no production service was contacted. Repeat with no session and assert `401` plus the route's error body.

The test should not mock `getAuthorizedUser`, `canAccessTeam`, or a Sanity query helper. Those are internal details; the session and data-store boundaries are the seams that may be faked.

### 2. Mutation route

For a route that updates a profile or document, seed the original record, configure an authenticated fixture user, and invoke the real `POST`, `PUT`, or `PATCH` handler with a realistic JSON request. Assert the success status and response body, then read the record through the test datastore and assert the persisted change. Also send malformed input and assert the validation response with no persisted change.

The assertion is the changed document, not “the update service was called once.” If the implementation later changes from one Sanity operation to a transaction, the test should remain valid.

### 3. Authorization-denied case

Seed a target team or profile that is unrelated to the authenticated regular user. Invoke the real protected handler using that user's session and target identifier. Assert `403` and the public error body, then read the target record and assert it is unchanged. Include a separate unauthenticated request where the contract distinguishes `401` from `403`.

Do not make the case pass by mocking an authorization helper to return `false`; make it pass by arranging the user, membership, and target fixtures so that the real authorization behavior denies access.

## Evidence required from implementing agents

Every testing implementation or change must report:

1. Which route-level behaviors were covered, including allowed, unauthenticated, and unauthorized paths where applicable.
2. Which fixture data and external-boundary fakes were used.
3. The exact verification command(s) that were run and whether they passed.
4. Evidence for response status/body assertions and data-mutation assertions.
5. Confirmation that production credentials and production services were not used.
6. Any scenarios intentionally left uncovered, with the reason and a follow-up ticket if one is needed.

The report should describe behavior and externally visible evidence. It should not claim coverage based only on internal mocks, method call counts, or source-level inspection.

## Non-goals for this phase

This strategy does not authorize or require adding Vitest, unit tests, application tests, Playwright, or browser tests. It also does not require changing production code. Those decisions belong to later, explicitly scoped work and must preserve the black-box route-level contract defined here.
