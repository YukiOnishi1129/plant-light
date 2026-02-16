import { getProducts } from "@/lib/data-loader";
import Link from "next/link";

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

export default async function Home() {
  const products = await getProducts();

  // ランキング順でソート（ranking昇順、なければreview_count降順）
  const sorted = [...products].sort((a, b) => {
    if (a.ranking && b.ranking) return a.ranking - b.ranking;
    return (b.review_count || 0) - (a.review_count || 0);
  });

  return (
    <div>
      <section className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-green-800">
          植物育成ライト おすすめランキング
        </h1>
        <p className="text-gray-600">
          楽天市場の植物育成ライトをスペック・レビューで徹底比較。
          AIが分析したおすすめポイントもチェックできます。
        </p>
      </section>

      {sorted.length === 0 ? (
        <p className="text-gray-500">
          商品データがまだありません。バッチを実行してください。
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((product, index) => (
            <article
              key={product.id}
              className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* ランキング番号 */}
              <div className="flex flex-col items-center justify-start pt-1">
                <span className="text-2xl font-bold text-green-700">
                  {index + 1}
                </span>
                <span className="text-xs text-gray-400">位</span>
              </div>

              {/* 商品画像 */}
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

              {/* 商品情報 */}
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
                  {product.shop_name && (
                    <span className="text-xs text-gray-400">
                      {product.shop_name}
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
                  {product.spectrum && (
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                      {product.spectrum}
                    </span>
                  )}
                  {product.socket_type && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {product.socket_type}
                    </span>
                  )}
                  {product.timer && (
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700">
                      タイマー
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-2">
                  {product.affiliate_url ? (
                    <a
                      href={product.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      🛒 楽天で価格を見る
                    </a>
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
    </div>
  );
}
