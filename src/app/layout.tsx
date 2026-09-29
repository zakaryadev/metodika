import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScriptProvider } from "@/lib/script-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.topic,
  keywords: [
    "профилактика",
    "вояга етмаганлар",
    "ҳуқуқбузарлик",
    "педагогика",
    "девиант хулқ",
    "ижтимоий педагог",
    "profilaktika",
    "voyaga yetmaganlar",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

/** Саҳифа юкланишидан олдин мавзуни ўрнатади — «оқ ялт этиш»нинг олдини олади */
const themeScript = `
(function(){
  try {
    var s = localStorage.getItem('metodika:theme');
    var d = s === 'dark';
    document.documentElement.dataset.theme = d ? 'dark' : 'light';
    var sc = localStorage.getItem('metodika:script');
    if (sc === 'lat' || sc === 'cyr') document.documentElement.dataset.script = sc;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz-Cyrl" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Бўёқ чизилишидан олдин ишга тушади — «оқ ялт этиш»нинг олдини олади.
            React дев-режимда script тегига огоҳлантириш беради; бу кутилган
            ҳолат, чунки скрипт фақат сервер HTML сидан бир марта бажарилади. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <div aria-hidden="true" className="top-bar" />
        <ScriptProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ScriptProvider>
      </body>
    </html>
  );
}
