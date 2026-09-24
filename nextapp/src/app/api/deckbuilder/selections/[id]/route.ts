import {
  getSelectionProfileTables,
  requireSelectionUser,
  selectionErrorResponse,
} from "@/src/lib/deck-builder/selections";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireSelectionUser();
    const { id } = await context.params;
    const tables = await getSelectionProfileTables(id, user);
    return Response.json(
      { tables },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return selectionErrorResponse(error);
  }
}
