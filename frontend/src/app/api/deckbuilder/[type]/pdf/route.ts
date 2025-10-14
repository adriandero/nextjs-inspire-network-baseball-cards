import type { Browser, Page } from "puppeteer-core";
import {
  initPuppeteer,
  waitForImages,
} from "@/src/lib/utils/puppeteer-helper";


export const maxDuration = 60;

export async function GET(
  req: Request,
  context: { params: Promise<{ type: string }> },
) {
  const type = (await context.params).type;
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
  const browser: Browser = await puppeteer.launch(launchOptions);
  console.timeEnd("browser-launch");

  const page: Page = await browser.newPage();

  await page.setViewport({
    width: 1200,   // ← Browser window width
    height: 1600,  // ← Browser window height
    deviceScaleFactor: 2,
  });

  console.time("page-navigation");
  await page.goto(
    process.env.BASE_URL +
      `/deckbuilder/${type}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRoleParam}`,
    { waitUntil: "load" },
  );
  console.timeEnd("page-navigation");

  console.time("image-wait");
  await waitForImages(page);
  console.timeEnd("image-wait");

  await page.emulateMediaType("screen");

  console.time("pdf-generation");
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: false, // Portrait for deck builder
  });
  console.timeEnd("pdf-generation");

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
