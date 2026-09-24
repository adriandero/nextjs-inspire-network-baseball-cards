import type { ProfileIdentifierTable } from "../entities/profile-identifier-table.model";

export async function createSelection(
  tables: ProfileIdentifierTable[],
): Promise<string> {
  const response = await fetch("/api/deckbuilder/selections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tables }),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.error ?? "Unable to save the selection");
  return body.id;
}
