import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "SIPERBAR - Sistem Informasi Peminjaman Barang Sekolah",
  description: "Solusi cerdas untuk manajemen peminjaman barang sekolah secara digital, transparan, dan efisien.",
  keywords: "peminjaman barang, inventaris sekolah, sistem informasi sekolah, sarana prasarana",
  authors: [{ name: "SIPERBAR Dev Team" }],
  openGraph: {
    title: "SIPERBAR - Sistem Informasi Peminjaman Barang",
    description: "Kelola inventaris barang sekolah Anda dengan sistem yang cerdas, aman, dan efisien.",
    url: "https://siperbar-sekolah.id",
    siteName: "SIPERBAR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SIPERBAR Dashboard Preview"
      }
    ],
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SIPERBAR - Sistem Informasi Peminjaman Barang",
    description: "Solusi digital untuk manajemen peminjaman sarana prasarana sekolah.",
    images: ["/twitter-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3b82f6" }
    ]
  },
  manifest: "/site.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <head />
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}