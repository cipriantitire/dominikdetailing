import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dominik Detailing",
  description:
    "Premium mobile car detailing with a quote-first booking workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
