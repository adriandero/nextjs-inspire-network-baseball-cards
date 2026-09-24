import { renderDeckPDF } from "@/src/lib/deck-builder/pdf";

export const maxDuration = 60;

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  return renderDeckPDF(request, (await context.params).type);
}
