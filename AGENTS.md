# Repository agent instructions

## Git workflow

- Use a dedicated Git worktree for implementation work when the primary checkout has unrelated changes.
- Name ticket branches with the Linear ticket identifier first, for example `IN-25-test-harness`.
- Do not use the `codex/` branch prefix in this repository.
- Keep unrelated dependency upgrades or changes from other agents out of ticket commits.

## Testing work

- Follow `TESTING.md`: prefer direct route-handler integration tests with fakes at external boundaries.
- Do not add browser end-to-end tests or business-logic unit tests unless a ticket explicitly changes that scope.
- For the Next app integration suite, run `npm run test:integration --workspace=nextapp`.
