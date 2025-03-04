import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
//import puppeteer from "puppeteer-core";

export const maxDuration = 30;

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  // const session = await auth0.getSession();
  const slug = (await context.params).slug;
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  // await page.setExtraHTTPHeaders({
  //   Authorization: Bearer ${session?.tokenSet.accessToken},
  // });
  await page.goto(process.env.BASE_URL + `/profiles/${slug}/pdf`, {
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
      })
    );
  });
  await page.emulateMediaType("screen");
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: true,
  });
  await browser.close();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
// create a new browser where i need to log in...
