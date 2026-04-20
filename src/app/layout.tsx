import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dominik Detailing | Premium Mobile Car Detailing in London",
  description:
    "Expert mobile car detailing, valeting, ceramic coating, and paint correction across London. We come to you. Request a quote today.",
  openGraph: {
    title: "Dominik Detailing | Premium Mobile Car Detailing in London",
    description:
      "Expert mobile car detailing, valeting, ceramic coating, and paint correction across London.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
