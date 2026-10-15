import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VISION OF LIFE — Preorder",
  icons: {
    icon: "/icon.ico",
  },
  description: "Join the EYEBREED Vision of Life preorder list.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
