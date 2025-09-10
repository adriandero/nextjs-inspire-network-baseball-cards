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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let puppeteer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let launchOptions: any;

  if (isProd) {
    const chromium = (await import("@sparticuz/chromium")).default;
    puppeteer = await import("puppeteer-core");

    launchOptions = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
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

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.goto(
    process.env.BASE_URL +
      `/deckbuilder/${type}/pdf?groupedProfiles=${groupedProfiles}&showJobRole=${showJobRoleParam}`,
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

  await new Promise((resolve) => setTimeout(resolve, 2000));

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
