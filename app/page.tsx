import { getProducts, getGuides, getKnowledgeArticles } from "@/lib/data-loader";
import Link from "next/link";
import { RakutenLink } from "@/components/rakuten-link";

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating * 2) / 2;
  return (
    <span className="text-yellow-500" title={`${rating}`}>
      {"★".repeat(Math.floor(stars))}
      {stars % 1 ? "☆" : ""}
    </span>
  );
}

const PLANT_GUIDES = [
  { slug: "monstera", label: "モンステラ", desc: "冬の日照不足で葉が黄色に…", image: "/images/plants/monstera.jpg" },
  { slug: "agave", label: "アガベ", desc: "徒長させたくない！", image: "/images/plants/agave.jpg" },
  { slug: "succulent", label: "多肉植物", desc: "冬越しの光が足りない", image: "/images/plants/succulent.jpg" },
  { slug: "caudex", label: "塊根植物", desc: "休眠期の光管理どうする？", image: "/images/plants/caudex.jpg" },
  { slug: "herb", label: "ハーブ", desc: "室内バジル・ミントを育てたい", image: "/images/plants/herb.jpg" },
  { slug: "vegetable", label: "室内野菜", desc: "レタス・トマトを室内栽培", image: "/images/plants/vegetable.jpg" },
  { slug: "platycerium", label: "ビカクシダ", desc: "壁掛けで室内育成、光量が命", image: "/images/plants/platycerium.jpg" },
  { slug: "ficus", label: "フィカス", desc: "冬の落葉を防ぎたい", image: "/images/plants/ficus.jpg" },
  { slug: "cactus", label: "サボテン", desc: "室内だと徒長しがち…", image: "/images/plants/cactus.jpg" },
  { slug: "airplant", label: "エアプランツ", desc: "土不要だけど光は必要", image: "/images/plants/airplant.jpg" },
  { slug: "aquatic-plants", label: "水草", desc: "アクアリウムのLED選び", image: "/images/plants/aquatic-plants.jpg" },
  { slug: "carnivorous", label: "食虫植物", desc: "ネペンテスを室内で育てる", image: "/images/plants/carnivorous.jpg" },
  { slug: "orchid", label: "胡蝶蘭", desc: "二度咲きさせたい！", image: "/images/plants/orchid.jpg" },
  { slug: "moss", label: "苔テラリウム", desc: "弱光でも適切な光管理", image: "/images/plants/moss.jpg" },
];

const KNOWLEDGE_TOPICS = [
  { slug: "led-vs-normal", label: "普通のLEDとの違い" },
  { slug: "ppfd", label: "PPFDとは？" },
  { slug: "spectrum", label: "フルスペクトルとは？" },
  { slug: "setup", label: "設置方法ガイド" },
  { slug: "how-to-choose", label: "失敗しない選び方" },
];

export default async function Home() {
  const products = await getProducts();

  // ランキング順（ranking昇順、なければreview_count降順）
  const sorted = [...products].sort((a, b) => {
    if (a.ranking && b.ranking) return a.ranking - b.ranking;
    return (b.review_count || 0) - (a.review_count || 0);
  });
  const top10 = sorted.slice(0, 10);

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="mb-10 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 p-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-green-900">
          あなたの植物に合うライトが見つかる
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          「葉が黄色くなった」「徒長してしまった」そんな悩みを解決。
          植物の種類ごとに必要なスペックを解説し、最適な育成ライトを提案します。
        </p>
      </section>

      {/* 悩みから探す */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          育てている植物から探す
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {PLANT_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-green-300 hover:shadow-md"
            >
              <div className="relative h-24 w-full overflow-hidden bg-green-50">
                <img
                  src={guide.image}
                  alt={guide.label}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="font-semibold text-gray-800">{guide.label}</span>
                <span className="mt-1 block text-xs text-gray-500">{guide.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 知識コンテンツ */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          育成ライトの基礎知識
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          初めて育成ライトを買う前に知っておきたいこと
        </p>
        <div className="flex flex-wrap gap-2">
          {KNOWLEDGE_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/knowledge/${topic.slug}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:border-green-300 hover:bg-green-50"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 人気ランキング TOP10 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          人気ランキング TOP10
        </h2>

        {top10.length === 0 ? (
          <p className="text-gray-500">商品データがまだありません。</p>
        ) : (
          <div className="space-y-3">
            {top10.map((product, index) => (
              <article
                key={product.id}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* ランキング */}
                <div className="flex flex-col items-center justify-start pt-1">
                  <span
                    className={`text-2xl font-bold ${
                      index < 3 ? "text-amber-500" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs text-gray-400">位</span>
                </div>

                {/* 画像 */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {product.image_urls && product.image_urls[0] ? (
                    <img
                      src={product.image_urls[0]}
                      alt={product.item_name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">
                      🌱
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/products/${product.id}`}
                    className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-green-700"
                  >
                    {product.item_name}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-bold text-red-600">
                      {formatPrice(product.item_price)}
                    </span>
                    {product.review_count > 0 && (
                      <span className="text-gray-500">
                        <StarRating
                          rating={Number(product.review_average) || 0}
                        />{" "}
                        ({product.review_count}件)
                      </span>
                    )}
                  </div>

                  {/* AIサマリー */}
                  {product.ai_summary && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                      {product.ai_summary}
                    </p>
                  )}

                  {/* スペックタグ */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.wattage && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                        {product.wattage}
                      </span>
                    )}
                    {product.form_factor && (
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                        {product.form_factor}
                      </span>
                    )}
                    {product.brand && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-2">
                    {product.affiliate_url ? (
                      <RakutenLink
                        url={product.affiliate_url}
                        productId={product.id}
                        source="ranking"
                        className="inline-block rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        楽天で価格を見る
                      </RakutenLink>
                    ) : (
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-block rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        詳細を見る
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
