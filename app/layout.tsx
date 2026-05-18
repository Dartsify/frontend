import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";

import moment from "moment";
import "moment/locale/fr";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi/Satoshi-Regular.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/Satoshi-Italic.woff2",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/Satoshi-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Dartsify",
  description: "Suivez vos performances au jeu de fléchettes avec Dartsify !",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // themeColor: "#2454ffff", // Optionnel : pour colorer la barre Safari
  themeColor: "#f9fcffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  moment.locale("fr");

  return (
    <html lang="fr">
      <meta name="apple-mobile-web-app-title" content="Dartsify" />
      <body className={`${satoshi.variable} ${roboto.className} antialiased`}>
        {children}
        {/* <Footer />  // TODO : add a footer to main layout */}
        {/* !!!! Footer is also shown in sub folders ! Need to limit this to the main layout (not dashboard) */}
      </body>
    </html>
  );
}
