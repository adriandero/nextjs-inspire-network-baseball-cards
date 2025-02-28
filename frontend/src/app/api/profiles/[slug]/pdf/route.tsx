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

    // Optimize network by modifying image quality but keeping all images
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Only block truly non-essential resources but keep all images
      if (
        resourceType === "font" ||
        resourceType === "media" ||
        resourceType === "stylesheet" ||
        resourceType === "script"
      ) {
        const url = req.url();
        if (
          url.includes("analytics") ||
          url.includes("tracking") ||
          url.includes("ads")
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
    // Navigate to the page - use networkidle0 to ensure everything is loaded
    await page.goto(process.env.BASE_URL + `/profiles/${slug}/pdf`, {
      waitUntil: "networkidle0", // Using networkidle0 to ensure complete loading
      timeout: 25000, // Increased timeout to ensure loading completes
    });

    // Wait for all images to load but optimize their quality first
    await page.evaluate(() => {
      // First, reduce image quality by setting max-width on all images
      const style = document.createElement("style");
      style.innerHTML = `
        img {
          max-width: 800px !important; 
          max-height: 600px !important;
          transform: translateZ(0); /* Force GPU acceleration */
        }
        svg {
          max-width: 800px !important;
          max-height: 600px !important;
        }
      `;
      document.head.appendChild(style);

      // Now wait for all images to load
      return Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if image fails
            // Set a reasonable timeout
            setTimeout(resolve, 8000);
          });
        })
      );
    });

    await page.emulateMediaType("screen");

    // Further optimize images before PDF generation
    await page.evaluate(() => {
      // Process SVGs to make them more lightweight
      const svgs = Array.from(document.querySelectorAll("svg"));
      svgs.forEach((svg) => {
        // Remove unnecessary SVG elements that won't affect the visual output
        const defs = svg.querySelectorAll("defs, metadata, script");
        defs.forEach((node) => node.remove());
      });

      // Convert high-resolution images to lower resolution
      const images = Array.from(document.images);
      images.forEach((img) => {
        if (!img.classList.contains("no-optimize")) {
          // Add inline styling to reduce the image quality
          img.style.imageRendering = "auto";
        }
      });
    });

    // Optimize PDF generation
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      preferCSSPageSize: true,
      timeout: 40000, // Increased timeout for PDF generation
      scale: 0.9, // Slightly reduce the scale to improve performance
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
