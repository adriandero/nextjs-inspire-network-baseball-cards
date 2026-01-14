import type { Browser, Page, LaunchOptions, HTTPRequest } from "puppeteer-core";

type PuppeteerModule = {
  launch: (options?: LaunchOptions) => Promise<Browser>;
};

export async function initPuppeteer() {
  const isProd = process.env.NODE_ENV === "production";

  const puppeteer = await import("puppeteer-core");
  let launchOptions: LaunchOptions;

  if (isProd) {
    const chromium = (await import("@sparticuz/chromium")).default;

    launchOptions = {
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  } else {
    // Use system Chrome in dev:
    // macOS examples:
    // "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    // "/Applications/Chromium.app/Contents/MacOS/Chromium"
    launchOptions = {
      headless: true,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    };
  }

  return { puppeteer: puppeteer as unknown as PuppeteerModule, launchOptions };
}

export async function waitForImages(page: Page) {
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
}

export function trackImageRequests(page: Page): () => number {
  let requestCount = 0;
  page.on("request", (request: HTTPRequest) => {
    if (request.resourceType() === "image") requestCount++;
  });
  return () => requestCount;
}
