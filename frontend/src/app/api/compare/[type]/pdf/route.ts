import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const maxDuration = 60;

export async function GET(
  req: Request,
  context: { params: Promise<{ type: string }> }
) {
  // Get query parameters
  const type = (await context.params).type;
  const url = new URL(req.url);
  const profiles = url.searchParams.get("profiles");

  // Limit number of profiles to prevent overload
  const profileList = profiles ? profiles.split(",").slice(0, 8).join(",") : "";

  // Launch browser with optimized settings
  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-sandbox",
    ],
    defaultViewport: { width: 1100, height: 1400 },
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Intercept and block non-essential resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (resourceType === "font" || resourceType === "media") {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Set timeout for navigation to be shorter
    await page.goto(
      process.env.BASE_URL + `/compare/${type}/pdf?profiles=${profileList}`,
      { waitUntil: "domcontentloaded", timeout: 25000 }
    );

    // Wait for specific render-ready signal
    await page.waitForSelector('[data-render-ready="true"]', {
      timeout: 25000,
    });

    // Generate PDF quickly
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: false,
    });

    return new Response(pdfBuffer, {
      headers: { "Content-Type": "application/pdf" },
    });
  } finally {
    await browser.close();
  }
}
