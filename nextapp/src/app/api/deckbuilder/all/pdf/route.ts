import { renderDeckPDF } from "@/src/lib/deck-builder/pdf";

export const maxDuration = 60;

export async function GET(request: Request) {
  return renderDeckPDF(request, "all");
}
