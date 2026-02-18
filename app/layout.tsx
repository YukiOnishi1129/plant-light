import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-WG9K31FYM4";

const SITE_URL = "https://plant-light.jp";
const SITE_NAME = "plant-light.jp";
const SITE_DESCRIPTION =
  "植物育成ライトの比較・おすすめサイト。モンステラ・アガベ・多肉植物など植物別に必要なスペックを解説し、最適な育成ライトを提案します。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `【2026年】植物育成ライトおすすめ比較 | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `【2026年】植物育成ライトおすすめ比較 | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-lg font-bold text-green-800">
                {SITE_NAME}
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-700">
                トップ
              </Link>
              <Link href="/privacy" className="hover:text-green-700">
                プライバシーポリシー
              </Link>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
              &copy; 2026 {SITE_NAME}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
