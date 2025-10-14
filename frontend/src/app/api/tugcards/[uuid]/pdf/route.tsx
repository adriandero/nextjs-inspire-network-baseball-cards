import { NextRequest } from "next/server";
import type { Browser, Page } from "puppeteer-core";
import { initPuppeteer, waitForImages } from "@/src/lib/utils/puppeteer-helper";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> },
) {
  const uuid = (await context.params).uuid;

  const { puppeteer, launchOptions } = await initPuppeteer();

  console.time("browser-launch");
  const browser: Browser = await puppeteer.launch(launchOptions);
  console.timeEnd("browser-launch");

  const page: Page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 2,
  });

  console.time("page-navigation");
  await page.goto(process.env.BASE_URL + `/tugcards/${uuid}/pdf`, {
    waitUntil: "load", // ← Changed from networkidle2
  });
  console.timeEnd("page-navigation");

  console.time("image-wait");
  await waitForImages(page);
  console.timeEnd("image-wait");

  await page.emulateMediaType("screen");

  console.time("pdf-generation");
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: true, // Keep landscape for TUG cards
  });
  console.timeEnd("pdf-generation");

  await browser.close();

  return new Response(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=tugcard.pdf",
    },
  });
}
