import { auth0 } from "@/lib/auth0";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const slug = (await context.params).slug;

  // Optimize browser launch options
  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-accelerated-2d-canvas",
    ],
    defaultViewport: {
      ...chromium.defaultViewport,
      width: 1280,
      height: 800,
    },
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Optimize network by blocking unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Block non-essential resources
      if (
        resourceType === "font" ||
        resourceType === "media" ||
        resourceType === "stylesheet" ||
        resourceType === "script"
      ) {
        // Only block non-essential CSS/JS - adjust based on your needs
        const url = req.url();
        if (
          url.includes("analytics") ||
          url.includes("tracking") ||
          url.includes("ads") ||
          (url.includes("cdn") && !url.includes("essential"))
        ) {
          req.abort();
        } else {
          req.continue();
        }
      } else {
        req.continue();
      }
    });

    // Set a timeout for navigation to avoid hanging
    await page.goto(process.env.BASE_URL + `/profiles/${slug}/pdf`, {
      waitUntil: "domcontentloaded", // Changed from networkidle2 for faster loading
      timeout: 15000, // 15 second timeout
    });

    // Load essential images only
    await page.evaluate(() => {
      const images = Array.from(document.images);
      const essentialImages = images.filter((img) => {
        // Define what makes an image essential - e.g., visible in viewport
        const rect = img.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      return Promise.all(
        essentialImages.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if image fails
            // Set a timeout for image loading
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    await page.emulateMediaType("screen");

    // Optimize PDF generation
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      preferCSSPageSize: true,
      timeout: 30000, // 30 second timeout for PDF generation
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600", // Add caching header
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: "PDF generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await browser.close();
  }
}
