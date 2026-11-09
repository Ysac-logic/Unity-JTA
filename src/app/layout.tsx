import type { Metadata, Viewport } from "next";
import { Inter, Anton, Montserrat, Playfair_Display, Mr_Dafoe } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-body", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display-face", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-montserrat", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const dafoe = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-dafoe", display: "swap" });

export const metadata: Metadata = {
  title: { default: "LOW UNITY JTA", template: "%s · LOW UNITY JTA" },
  description: "Plataforma oficial de consultoria fitness LOW UNITY JTA.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${anton.variable} ${montserrat.variable} ${playfair.variable} ${dafoe.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
