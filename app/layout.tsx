import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weena2d1n.com"),
  title: "Weena Tour | เข้าป่า 2 Days 1 Night",
  description:
    "แพ็กเกจท่องเที่ยวและทริปเดินป่าทั้งในประเทศและต่างประเทศ โดย Weena Tour",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Weena Tour | เข้าป่า 2 Days 1 Night",
    description:
      "แพ็กเกจท่องเที่ยวและทริปเดินป่าทั้งในประเทศและต่างประเทศ โดย Weena Tour",
    url: "/",
    siteName: "Weena Tour",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/weena-cover.png",
        width: 1600,
        height: 400,
        alt: "Weena Tour | เข้าป่า 2 Days 1 Night",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weena Tour | เข้าป่า 2 Days 1 Night",
    description:
      "แพ็กเกจท่องเที่ยวและทริปเดินป่าทั้งในประเทศและต่างประเทศ โดย Weena Tour",
    images: ["/weena-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
