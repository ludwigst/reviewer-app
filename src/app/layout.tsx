import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { ReviewerProvider } from "@/components/reviewer-provider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LET Reviewer",
  description: "AI-powered LET board exam reviewer",
  applicationName: "LET Reviewer",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LET Reviewer",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3ecdc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReviewerProvider>{children}</ReviewerProvider>
      </body>
    </html>
  );
}
