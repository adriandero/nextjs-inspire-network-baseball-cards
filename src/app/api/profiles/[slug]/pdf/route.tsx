import puppeteer from "puppeteer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const slug = (await context.params).slug;

  await page.goto(process.env.BASE_URL + `/profiles/${slug}/pdf`, {
    waitUntil: "networkidle2",
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
