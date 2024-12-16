// import { auth0 } from "@/lib/auth0";

import { chromium } from "playwright";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const slug = (await context.params).slug;

  // Launch a Chromium browser instance
  const browser = await chromium.launch({
    headless: true,
  });

  const contextInstance = await browser.newContext();
  const page = await contextInstance.newPage();

  // Navigate to the target URL
  await page.goto(`${process.env.BASE_URL}/profiles/${slug}/pdf`, {
    waitUntil: "networkidle",
  });

  // Ensure all images are fully loaded
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

  // Emulate screen media type for rendering
  await page.emulateMedia({ media: "screen" });

  // Generate the PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: true,
  });

  // Close the browser
  await browser.close();

  // Return the PDF buffer as a response
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}

// create a new browser where i need to log in...
