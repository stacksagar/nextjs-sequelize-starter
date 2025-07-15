import { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Cabin } from "next/font/google";

import "./globals.css";
// packages css
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/components/theme/ThemeProvider";
import connectDB from "@/config/connectDB";

import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "./ReactQueryProvider";
import { GlobalProvider } from "@/store/GlobalContext";

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  description:
    "Kuponna – Your ultimate destination for exclusive deals and discounts on shopping, dining, travel, and more. Save big on your favorite brands and experiences! 🚀",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectDB();

  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <ColorSchemeScript defaultColorScheme="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`bg-white dark:bg-gray-900 !text-gray-900 dark:!text-gray-100 ${cabin.className} antialiased light`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#060ACD" />
        <ThemeProvider>
          <ReactQueryProvider>
            <GlobalProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
              />
              {children}
            </GlobalProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Force this to be a server component
export const dynamic = "force-dynamic";
