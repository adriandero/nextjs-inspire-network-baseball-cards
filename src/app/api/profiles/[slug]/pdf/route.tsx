/* eslint-disable @typescript-eslint/no-unused-vars */
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const slug = (await context.params).slug;

  // Set a longer default timeout for the entire browser operation (30 minutes)
  const BROWSER_TIMEOUT = 30 * 60 * 1000;

  const browser = await puppeteer.launch({
    args: [...chromium.args, "--disable-dev-shm-usage", "--no-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
    timeout: BROWSER_TIMEOUT, // Set browser launch timeout
  });

  const page = await browser.newPage();

  // Set page-level timeouts
  await page.setDefaultNavigationTimeout(BROWSER_TIMEOUT);
  await page.setDefaultTimeout(BROWSER_TIMEOUT);

  try {
    // Navigate to the page with longer timeout
    await page.goto(process.env.BASE_URL + `/profiles/${slug}/pdf`, {
      waitUntil: "networkidle2",
      timeout: BROWSER_TIMEOUT,
    });

    // Wait for all images to load with timeout
    await Promise.race([
      page.evaluate(() => {
        return Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Just resolve instead of rejecting to avoid failing on image errors
            });
          })
        );
      }),
      new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000)), // 2-minute timeout for images
    ]);

    // Add wait for SVGs to be loaded and rendered
    await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll("svg"));
      return new Promise((resolve) => {
        // Give SVGs time to render
        setTimeout(resolve, 5000);
      });
    });

    await page.emulateMediaType("screen");

    // Generate PDF with timeout
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      timeout: BROWSER_TIMEOUT,
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    await browser.close();

    let errorMessage = "Unknown error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(`PDF generation failed: ${errorMessage}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
