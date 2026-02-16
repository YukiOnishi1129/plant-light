import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "植物育成ライト比較・おすすめランキング | plant-light.jp",
  description:
    "植物育成ライトの比較・おすすめランキングサイト。スペック・レビューをAIで分析し、観葉植物・多肉植物・野菜栽培に最適なライトを紹介します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-lg font-bold text-green-800">
                plant-light.jp
              </span>
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 plant-light.jp</p>
        </footer>
      </body>
    </html>
  );
}
