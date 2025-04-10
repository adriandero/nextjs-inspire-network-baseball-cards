import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  // Get query parameters
  const url = new URL(req.url);
  const profiles = url.searchParams.get("profiles");

  // Launch browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  // Set viewport to A4 size
  await page.setViewport({
    width: 1240,
    height: 1754, // A4 aspect ratio
    deviceScaleFactor: 1.5, // Higher resolution
  });

  await page.goto(
    process.env.BASE_URL + `/compare/workingGenius/pdf?profiles=${profiles}`,
    {
      waitUntil: "networkidle2",
    }
  );

  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${img.src}`));
        });
      })
    );
  });

  await page.emulateMediaType("screen");
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: true,
  });
  await browser.close();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
