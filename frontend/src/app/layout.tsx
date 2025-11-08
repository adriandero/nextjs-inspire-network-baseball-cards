import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/src/components/shadcn-ui/toaster";
import { DynamicStatsigProvider } from "@/src/lib/utils/dynamic-statsig-provider";
import { getUserSanity } from "@/src/lib/data/users";
import { statsigAdapter } from "@flags-sdk/statsig";
import { auth0 } from "@/src/lib/auth0";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
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
  const session = await auth0.getSession();

  let userData = {
    userID: "anonymous",
    statsigEnvironment: {
      tier: "development",
    },
    custom: {
      permission: "user",
    },
  };

  if (session) {
    const userProfileData = await getUserSanity(session.user);
    userData = {
      userID: session.user.sub,
      statsigEnvironment: {
        tier: process.env.ENVIRONMENT ?? "development",
      },
      custom: {
        permission: userProfileData?.permission ?? "user",
      },
    };
  }

  const Statsig = await statsigAdapter.initialize();
  const datafile = await Statsig.getClientInitializeResponse(userData, {
    hash: "djb2",
  });

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}  bg-mainbackground text-dark1`}
    >
      <body className="font-sans bg-mainbackground antialiased text-dark1 flex justify-center">
        <DynamicStatsigProvider datafile={datafile}>
          <main className="w-full max-w-screen-lg">{children}</main>
          <Toaster />
        </DynamicStatsigProvider>
      </body>
    </html>
  );
}
