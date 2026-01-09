import type { Metadata } from "next";
import { ClientToaster } from "@/components/ClientToaster";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ClientToaster />
      </body>
    </html>
  );
}
