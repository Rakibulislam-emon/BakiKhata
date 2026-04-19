import type { Metadata } from "next";
import { ClientToaster } from "@/components/ClientToaster";
import { AnimationProvider } from "@/components/AnimationProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাকি খাতা - গ্রাহকদের বাকির ডিজিটাল হিসাব",
  description:
    "সহজেই গ্রাহকদের বাকির হিসাব রাখুন, পেমেন্ট ট্যাকিং করুন এবং আপনার ব্যবসাকে ডিজিটাল করুন।",
  keywords: [
    "বাকি খাতা",
    "Baki Khata",
    "Business Tracker",
    "Customer Management",
  ],
  authors: [{ name: "Baki Khata Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Noto_Sans_Bengali } from "next/font/google";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-bengali",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body className={notoSansBengali.className}>
        <AnimationProvider>
          {children}
          <ClientToaster />
        </AnimationProvider>
      </body>
    </html>
  );
}
