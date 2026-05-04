import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreePDF — 29 Free Online PDF Tools | No Signup Required",
  description:
    "Merge, compress, split, convert and edit PDF files online for free. No signup required. Files deleted after 1 hour. 29 PDF tools available instantly.",
  keywords:
    "free pdf tools, compress pdf, merge pdf, pdf to word, split pdf, online pdf editor",
  openGraph: {
    title: "FreePDF — 29 Free Online PDF Tools",
    description: "Merge, compress, split, convert PDF files free online",
    url: "https://freepdf-psi.vercel.app",
    siteName: "FreePDF",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
