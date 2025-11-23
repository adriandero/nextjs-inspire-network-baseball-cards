import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IN TUG Cards",
  description: "TUG Cards by Inspire Network",
  icons: {
    icon: "images/favicon.ico",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}  bg-mainbackground text-dark1`}
    >
      <body className="font-sans bg-mainbackground antialiased text-dark1 flex justify-center">
        <main>{children}</main>
      </body>
    </html>
  );
}
