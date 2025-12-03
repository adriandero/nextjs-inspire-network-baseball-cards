import type { Browser, Page, LaunchOptions, HTTPRequest } from "puppeteer-core";

type PuppeteerModule = {
  launch: (options: LaunchOptions) => Promise<Browser>;
};

export async function initPuppeteer() {
  const isProd = process.env.NODE_ENV === "production";

  let puppeteer: PuppeteerModule;
  let launchOptions: LaunchOptions;

  if (isProd) {
    const chromium = (await import("@sparticuz/chromium")).default;
    puppeteer = await import("puppeteer-core");

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
    puppeteer = await import("puppeteer");
    launchOptions = {
      headless: true,
    };
  }

  return { puppeteer, launchOptions };
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
      }),
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
