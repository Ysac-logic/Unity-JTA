import type { Metadata } from "next";
import { Mr_Dafoe } from "next/font/google";
import { site } from "@/content/landing";

const sign = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-sign-face", display: "swap" });

export const metadata: Metadata = {
  title: { absolute: site.seo.title },
  description: site.seo.description,
  openGraph: { title: site.seo.title, description: site.seo.description, type: "website", locale: "pt_BR" },
  robots: { index: true, follow: true },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lu-root ${sign.variable}`}>{children}</div>;
}
