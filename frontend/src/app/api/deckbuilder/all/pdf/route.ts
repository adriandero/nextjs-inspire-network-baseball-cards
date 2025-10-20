import { initPuppeteer, waitForImages } from "@/src/lib/utils/puppeteer-helper";
import {
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { mergePDFs } from "@/src/lib/utils/pdf-merger";

export const maxDuration = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const groupedProfiles = url.searchParams.get("groupedProfiles");
  const showJobRoleParam = url.searchParams.get("showJobRole");
  const warmup = url.searchParams.get("warm") === "true";

  const { puppeteer, launchOptions } = await initPuppeteer();

  if (warmup) {
    const browser = await puppeteer.launch(launchOptions);
    await browser.close();
    return new Response(JSON.stringify({ status: "warmed" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  console.time("browser-launch");
  const browser = await puppeteer.launch(launchOptions);
  console.timeEnd("browser-launch");

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 2,
  });

  // Get all comparison types and their slugs
  const comparisonTypes = Object.values(CompareTypes).map(
    (type) => COMPARISON_ATTRIBUTES[type].slug,
  );

  const pdfBuffers: Buffer[] = [];

  for (const slug of comparisonTypes) {
    console.time(`pdf-generation-${slug}`);

    console.time(`navigation-${slug}`);
    await page.goto(
      `${process.env.BASE_URL}/deckbuilder/${slug}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRoleParam}`,
      { waitUntil: "load" },
    );
    console.timeEnd(`navigation-${slug}`);

    console.time(`image-wait-${slug}`);
    await waitForImages(page);
    console.timeEnd(`image-wait-${slug}`);

    await page.emulateMediaType("screen");

    console.time(`pdf-gen-${slug}`);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: false,
    });
    console.timeEnd(`pdf-gen-${slug}`);

    pdfBuffers.push(Buffer.from(pdfBuffer));

    console.timeEnd(`pdf-generation-${slug}`);
  }

  await browser.close();

  console.time("pdf-merge");
  const mergedPdf = await mergePDFs(pdfBuffers);
  console.timeEnd("pdf-merge");

  return new Response(mergedPdf, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
