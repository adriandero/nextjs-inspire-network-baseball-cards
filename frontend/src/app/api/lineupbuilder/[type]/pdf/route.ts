import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const maxDuration = 60;

export async function GET(
  req: Request,
  context: { params: Promise<{ type: string }> },
) {
  // Get query parameters
  const type = (await context.params).type;
  const url = new URL(req.url);
  const groupedProfiles = url.searchParams.get("groupedProfiles");
  const showJobRoleParam = url.searchParams.get("showJobRole");
  const warmup = url.searchParams.get("warm") === "true";

  if (warmup) {
    // Initialize browser but don't generate full PDF
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    await browser.close();
    return new Response(JSON.stringify({ status: "warmed" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  // Launch browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(
    process.env.BASE_URL +
      `/lineupbuilder/${type}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRoleParam}`,
    {
      waitUntil: "networkidle2",
    },
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
      }),
    );
  });

  await page.emulateMediaType("screen");
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: false,
  });
  await browser.close();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
