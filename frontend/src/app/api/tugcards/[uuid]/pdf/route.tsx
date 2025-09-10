import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> },
) {
  const isProd = process.env.NODE_ENV === "production";
  const uuid = (await context.params).uuid;

  // Conditional puppeteer setup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let puppeteer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let launchOptions: any;

  if (isProd) {
    const chromium = (await import("@sparticuz/chromium")).default;
    puppeteer = await import("puppeteer-core");

    launchOptions = {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  } else {
    puppeteer = await import("puppeteer");
    launchOptions = {
      headless: true,
    };
  }

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL + `/tugcards/${uuid}/pdf`, {
    waitUntil: "networkidle2",
  });
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
    landscape: true,
  });

  await browser.close();

  return new Response(pdfBuffer as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=tugcard.pdf",
    },
  });
}
