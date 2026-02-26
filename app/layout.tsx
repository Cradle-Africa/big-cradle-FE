import type { Metadata } from "next";
import Script from "next/script";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import "./theme-config.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Big cradle",
  description: "Unlock Africa’s most authentic consumer insights",
  icons: {
    icon: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <Script
          src="https://pay.kuvarpay.com/kuvarpay-sdk.js"
          strategy="beforeInteractive"
        />
        <QueryProvider>
          <ReduxProvider>
            <Theme>
              <main>{children}</main>
            </Theme>
            <Toaster position="top-right" reverseOrder={false} />
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
