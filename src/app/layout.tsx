import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

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
    <html lang="en" className={`h-full ${GeistSans.variable}`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
