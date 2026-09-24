import {
  requireSelectionUser,
  saveSelection,
  selectionErrorResponse,
} from "@/src/lib/deck-builder/selections";

export async function POST(request: Request) {
  try {
    const user = await requireSelectionUser();
    const body = await request.json();
    const id = await saveSelection(body?.tables, user);
    return Response.json(
      { id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return selectionErrorResponse(error);
  }
}
