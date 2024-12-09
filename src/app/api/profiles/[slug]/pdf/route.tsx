// import { getProfileBySlug } from "@/api/profileRequests";
// import React from 'react';
// import { Document, Page, View,Text,  StyleSheet, renderToStream } from '@react-pdf/renderer';
// import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// });

// // Create Document Component
// const MyDocument = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Section #1</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Section #2</Text>
//       </View>
//     </Page>
//   </Document>
// );
// export async function GET(request: Request, {params}: {params: {slug: string;}}) {

//     const stream = await renderToStream(<MyDocument />);

//     return new NextResponse(stream as unknown as ReadableStream)
// }
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
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

  return new Response(pdfBuffer);
}
