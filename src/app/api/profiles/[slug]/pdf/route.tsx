// import { auth0 } from "@/lib/auth0";
import puppeteer from "puppeteer";
//import puppeteer from "puppeteer-core";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  // const session = await auth0.getSession();
  const slug = (await context.params).slug;
  console.log("Chromium executable path:", await puppeteer.executablePath());

  const browser = await puppeteer.launch({
    headless: true, // Make sure it's headless
    args: [
      "--no-sandbox", // Prevent sandbox errors (needed for cloud environments like Vercel)
      "--disable-setuid-sandbox", // Disable sandboxing (another requirement for cloud environments)
    ],
  });

  const page = await browser.newPage();
  // await page.setExtraHTTPHeaders({
  //   Authorization: `Bearer ${session?.tokenSet.accessToken}`,
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
    format: "a4",
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
