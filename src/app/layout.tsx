import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shade & Shine | Premium Detailing & Tinting | Norfolk County, ON",
  description:
    "Premium automotive detailing, ceramic coating, window tint, paint correction, PPF, and vinyl wraps in Norfolk County. Book your transformation today.",
  keywords: [
    "auto detailing",
    "ceramic coating",
    "window tint",
    "paint correction",
    "Norfolk County",
    "Simcoe ON",
    "Feynlab",
    "vinyl wrap",
    "PPF",
    "XPEL",
  ],
  openGraph: {
    title: "Shade & Shine | Premium Detailing & Tinting",
    description:
      "Transform your vehicle with expert detailing, ceramic coating, tint, and wraps in Norfolk County.",
    type: "website",
    locale: "en_CA",
    images: [{ url: "/brand/banner-instagram.jpg", width: 1080, height: 566 }],
  },
  icons: {
    icon: "/brand/icon.jpg",
    apple: "/brand/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
