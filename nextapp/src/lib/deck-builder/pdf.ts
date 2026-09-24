import type { Browser } from "puppeteer-core";
import {
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { initPuppeteer, waitForImages } from "@/src/lib/utils/puppeteer-helper";
import { mergePDFs } from "@/src/lib/utils/pdf-merger";
import { parseProfileTablesFromURL } from "@/src/lib/utils/profile-table-utils";
import {
  getSelectionProfileTables,
  requireSelectionUser,
  saveSelection,
  SelectionError,
  selectionErrorResponse,
} from "./selections";

export async function renderDeckPDF(request: Request, type: string) {
  let browser: Browser | undefined;
  try {
    const user = await requireSelectionUser();
    const types = Object.values(CompareTypes);
    if (type !== "all" && !types.includes(type as CompareTypes)) {
      throw new SelectionError("Unknown comparison type", 400);
    }
    const params = new URL(request.url).searchParams;
    let selection = params.get("selection");
    // Upgrade legacy PDF links before opening Chromium to keep its requests small too.
    if (!selection && params.get("groupedProfiles")) {
      selection = await saveSelection(
        parseProfileTablesFromURL(params.get("groupedProfiles")!),
        user,
      );
    }
    if (!selection) throw new SelectionError("A selection is required", 400);
    await getSelectionProfileTables(selection, user);

    const { puppeteer, launchOptions } = await initPuppeteer();
    browser = await puppeteer.launch(launchOptions);
    if (params.get("warm") === "true")
      return Response.json({ status: "warmed" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    const baseURL = new URL(
      process.env.BASE_URL || new URL(request.url).origin,
    );
    // Scope the caller's session to the app origin, never to image or analytics hosts.
    const cookies = (request.headers.get("cookie") ?? "")
      .split(";")
      .flatMap((entry) => {
        const separator = entry.indexOf("=");
        if (separator < 1) return [];
        return [
          {
            name: entry.slice(0, separator).trim(),
            value: entry.slice(separator + 1).trim(),
            url: baseURL.origin,
            path: "/",
            secure: baseURL.protocol === "https:",
            httpOnly: true,
          },
        ];
      });
    if (cookies.length) await page.setCookie(...cookies);

    const buffers: Buffer[] = [];
    for (const comparisonType of type === "all"
      ? types
      : [type as CompareTypes]) {
      const url = new URL(
        `/deckbuilder/${COMPARISON_ATTRIBUTES[comparisonType].slug}/pdf`,
        baseURL,
      );
      url.searchParams.set("selection", selection);
      url.searchParams.set(
        "showJobRole",
        String(params.get("showJobRole") === "true"),
      );
      url.searchParams.set(
        "showPrimaryOnly",
        String(params.get("showPrimaryOnly") === "true"),
      );
      const response = await page.goto(url.href, { waitUntil: "networkidle2" });
      if (!response || !response.ok())
        throw new Error("Unable to open the PDF page");
      await page.waitForSelector('[data-pdf-ready="true"], [data-pdf-error]');
      const renderError = await page.$eval(
        '[data-pdf-ready="true"], [data-pdf-error]',
        (element) => element.getAttribute("data-pdf-error"),
      );
      if (renderError) throw new Error(renderError);
      await waitForImages(page);
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMediaType("screen");
      buffers.push(
        Buffer.from(
          await page.pdf({
            format: "A4",
            printBackground: true,
            landscape: false,
          }),
        ),
      );
    }
    const pdf = type === "all" ? await mergePDFs(buffers) : buffers[0];
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return selectionErrorResponse(error);
  } finally {
    await browser?.close();
  }
}
