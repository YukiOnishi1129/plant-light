import {
  getGuides,
  getGuideBySlug,
  getProductById,
} from "@/lib/data-loader";
import type { GuideRecommendedProduct } from "@/lib/data-loader";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

const PLANT_IMAGES: Record<string, string> = {
  monstera: "/images/plants/monstera.jpg",
  agave: "/images/plants/agave.jpg",
  succulent: "/images/plants/succulent.jpg",
  caudex: "/images/plants/caudex.jpg",
  herb: "/images/plants/herb.jpg",
  vegetable: "/images/plants/vegetable.jpg",
  platycerium: "/images/plants/platycerium.jpg",
  ficus: "/images/plants/ficus.jpg",
  cactus: "/images/plants/cactus.jpg",
  airplant: "/images/plants/airplant.jpg",
  "aquatic-plants": "/images/plants/aquatic-plants.jpg",
  carnivorous: "/images/plants/carnivorous.jpg",
  orchid: "/images/plants/orchid.jpg",
  moss: "/images/plants/moss.jpg",
};

const PLANT_EMOJI: Record<string, string> = {
  monstera: "🪴",
  agave: "🌵",
  succulent: "🌿",
  caudex: "🌳",
  herb: "🌿",
  vegetable: "🥬",
  platycerium: "🦇",
  ficus: "🌳",
  cactus: "🌵",
  airplant: "🌬️",
  "aquatic-plants": "🐠",
  carnivorous: "🪴",
  orchid: "🌸",
  moss: "🌱",
};

function truncateIntro(intro: string, maxLen = 100): string {
  if (intro.length <= maxLen) return intro;
  const cut = intro.slice(0, maxLen);
  const lastPeriod = cut.lastIndexOf("。");
  if (lastPeriod > 50) return cut.slice(0, lastPeriod + 1);
  return cut + "…";
}

/** "50〜150 µmol/m²/s（説明文...）" → "50〜150" */
function extractSpecValue(raw: string): string {
  // 括弧の前で切る
  const beforeParen = raw.split("（")[0].split("(")[0].trim();
  // 単位を除去してコア数値だけ残す
  return beforeParen
    .replace(/\s*µmol\/m²\/s/g, "")
    .replace(/\s*時間$/g, "時間")
    .trim();
}

async function RecommendedProductCard({
  rec,
  rank,
}: {
  rec: GuideRecommendedProduct;
  rank: number;
}) {
  const product = await getProductById(rec.product_id);
  if (!product) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ランクバッジ */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-linear-to-r from-green-50 to-white px-4 py-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
            rank === 1
              ? "bg-amber-500"
              : rank === 2
                ? "bg-gray-400"
                : "bg-amber-700"
          }`}
        >
          {rank}
        </span>
        <span className="text-xs font-medium text-gray-500">
          {rec.target}
        </span>
      </div>

      <div className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {product.image_urls && product.image_urls[0] ? (
              <img
                src={product.image_urls[0]}
                alt={product.item_name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">
                🌱
              </div>
            )}
          </div>
          <div className="flex-1">
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-2 font-semibold text-gray-900 hover:text-green-700"
            >
              {product.item_name}
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(product.item_price)}
              </span>
              {product.brand && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                  {product.brand}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 推薦理由 */}
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2">
          <p className="text-sm leading-relaxed text-gray-700">{rec.reason}</p>
        </div>

        {/* スペック */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.ppfd && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              PPFD: {product.ppfd}
            </span>
          )}
          {product.wattage && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {product.wattage}
            </span>
          )}
          {product.spectrum && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {product.spectrum}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4">
          {product.affiliate_url ? (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-red-500 py-2.5 text-center text-sm font-bold text-white hover:bg-red-600"
            >
              楽天で価格を見る
            </a>
          ) : (
            <Link
              href={`/products/${product.id}`}
              className="block rounded-lg bg-green-600 py-2.5 text-center text-sm font-bold text-white hover:bg-green-700"
            >
              詳細を見る
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const heroImage = PLANT_IMAGES[slug];
  const emoji = PLANT_EMOJI[slug] || "🌱";
  const shortIntro = guide.intro ? truncateIntro(guide.intro) : null;

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-green-700 hover:underline"
      >
        ← トップに戻る
      </Link>

      {/* ヒーロー: 画像＋タイトル＋短文 */}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
        {heroImage && (
          <div className="relative h-48 w-full overflow-hidden bg-green-100 sm:h-56">
            <img
              src={heroImage}
              alt={guide.plant_name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="text-3xl">{emoji}</span>
              <h1 className="mt-1 text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                {guide.title}
              </h1>
            </div>
          </div>
        )}
        {!heroImage && (
          <div className="p-5">
            <span className="text-3xl">{emoji}</span>
            <h1 className="mt-1 text-xl font-bold text-green-900 sm:text-2xl">
              {guide.title}
            </h1>
          </div>
        )}

        {/* 短いイントロ */}
        {shortIntro && (
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-sm leading-relaxed text-gray-600">
              {shortIntro}
            </p>
          </div>
        )}
      </div>

      {/* 必要スペック（上に配置） */}
      {guide.required_specs && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm">
              📊
            </span>
            {guide.plant_name}に必要な光のスペック
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {guide.required_specs.ppfd_range && (
              <div className="rounded-xl border border-green-200 bg-linear-to-b from-green-50 to-white p-3 text-center">
                <div className="text-[10px] font-medium text-green-600">
                  PPFD
                </div>
                <div className="mt-1 text-lg font-bold text-green-800">
                  {extractSpecValue(guide.required_specs.ppfd_range)}
                </div>
                <div className="text-[10px] text-gray-400">µmol/m²/s</div>
              </div>
            )}
            {guide.required_specs.color_temp && (
              <div className="rounded-xl border border-blue-200 bg-linear-to-b from-blue-50 to-white p-3 text-center">
                <div className="text-[10px] font-medium text-blue-600">
                  色温度
                </div>
                <div className="mt-1 text-lg font-bold text-blue-800">
                  {extractSpecValue(guide.required_specs.color_temp)}
                </div>
              </div>
            )}
            {guide.required_specs.daily_hours && (
              <div className="rounded-xl border border-purple-200 bg-linear-to-b from-purple-50 to-white p-3 text-center">
                <div className="text-[10px] font-medium text-purple-600">
                  照射時間
                </div>
                <div className="mt-1 text-lg font-bold text-purple-800">
                  {extractSpecValue(guide.required_specs.daily_hours)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* おすすめ商品（メインコンテンツ） */}
      {guide.recommended_products && guide.recommended_products.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-sm">
              🏆
            </span>
            {guide.plant_name}におすすめのライト
          </h2>
          <div className="space-y-4">
            {guide.recommended_products.map((rec, i) => (
              <RecommendedProductCard key={i} rec={rec} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 設置のコツ */}
      {guide.setup_tips && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm">
              💡
            </span>
            設置のコツ
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {guide.setup_tips}
            </p>
          </div>
        </section>
      )}

      {/* イントロ全文（もっと詳しく） */}
      {guide.intro && guide.intro.length > 100 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm">
              📖
            </span>
            {guide.plant_name}と光の関係
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-gray-700">
              {guide.intro}
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      {guide.faq && guide.faq.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm">
              ❓
            </span>
            よくある質問
          </h2>
          <div className="space-y-2">
            {guide.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 marker:text-green-600">
                  Q. {item.question}
                </summary>
                <div className="border-t border-gray-100 px-4 py-3">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
