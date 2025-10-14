import type {
  Browser,
  Page,
  LaunchOptions,
  HTTPRequest,
} from "puppeteer-core";

export const maxDuration = 60;

export async function GET(
  req: Request,
  context: { params: Promise<{ type: string }> },
) {
  const isProd = process.env.NODE_ENV === "production";

  const type = (await context.params).type;
  const url = new URL(req.url);
  const groupedProfiles = url.searchParams.get("groupedProfiles");
  const showJobRoleParam = url.searchParams.get("showJobRole");
  const warmup = url.searchParams.get("warm") === "true";

  // Dynamically import puppeteer + chromium based on env
  type PuppeteerModule = {
    launch: (options: LaunchOptions) => Promise<Browser>;
  };

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

  let requestCount = 0;

  page.on("request", (request: HTTPRequest) => {
    if (request.resourceType() === "image") requestCount++;
  });

  console.time("page-navigation");

  await page.goto(
    process.env.BASE_URL +
      `/deckbuilder/${type}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRoleParam}`,
    {
      waitUntil: "load",
    },
  );

  console.timeEnd("page-navigation");
  console.log(`Total image requests: ${requestCount}`);

  console.time("image-wait");

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
  console.timeEnd("image-wait");

  await page.emulateMediaType("screen");
  console.time("pdf-generation");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: false,
  });
  console.timeEnd("pdf-generation");

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
