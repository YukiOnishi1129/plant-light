import { getProducts, getProductById } from "@/lib/data-loader";
import type { Metadata } from "next";
import type { Product } from "@/lib/data-loader";
import Link from "next/link";
import { RakutenLink } from "@/components/rakuten-link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return {};

  const title = `${product.item_name}｜スペック・レビュー・口コミ`;
  const description = product.ai_summary
    ? product.ai_summary.slice(0, 120) + "…"
    : `${product.item_name}のスペック・レビュー・価格情報。植物育成ライトの詳細を確認できます。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://plant-light.jp/products/${id}`,
      images: product.image_urls?.[0] ? [product.image_urls[0]] : undefined,
    },
    alternates: {
      canonical: `https://plant-light.jp/products/${id}`,
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: String(p.id) }));
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function SpecTable({ product }: { product: Product }) {
  const specs = [
    { label: "消費電力", value: product.wattage },
    { label: "スペクトル", value: product.spectrum },
    { label: "色温度", value: product.color_temp },
    { label: "PPFD", value: product.ppfd },
    { label: "照度", value: product.lux },
    { label: "口金", value: product.socket_type },
    { label: "タイマー", value: product.timer },
    { label: "調光", value: product.dimming },
    { label: "寿命", value: product.lifespan },
    { label: "サイズ", value: product.size },
  ].filter((s) => s.value);

  if (specs.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-bold text-gray-800">スペック</h2>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-b border-gray-100">
              <td className="w-28 py-2 font-medium text-gray-500">
                {spec.label}
              </td>
              <td className="py-2 text-gray-800">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-green-700 hover:underline"
      >
        ← ランキングに戻る
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* 商品画像 + 基本情報 */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 画像 */}
          <div className="shrink-0 md:w-80">
            {product.image_urls && product.image_urls[0] ? (
              <img
                src={product.image_urls[0]}
                alt={product.item_name}
                className="w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-60 w-full items-center justify-center rounded-lg bg-gray-100 text-6xl">
                🌱
              </div>
            )}
            {/* サブ画像 */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {product.image_urls.slice(1, 5).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="h-16 w-16 rounded border border-gray-200 object-contain"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 基本情報 */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {product.item_name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(product.item_price)}
              </span>
              {product.review_count > 0 && (
                <span className="text-sm text-gray-500">
                  <span className="text-yellow-500">★</span>{" "}
                  {product.review_average} ({product.review_count}件)
                </span>
              )}
            </div>

            {product.shop_name && (
              <p className="mt-1 text-sm text-gray-400">
                販売: {product.shop_name}
              </p>
            )}

            {/* カテゴリ・タグ */}
            {product.categories && product.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {product.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {product.use_tags && product.use_tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.use_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* AIサマリー */}
            {product.ai_summary && (
              <div className="mt-4 rounded-lg bg-green-50 p-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {product.ai_summary}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-4">
              {product.affiliate_url && (
                <RakutenLink
                  url={product.affiliate_url}
                  productId={product.id}
                  source="detail_top"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
                >
                  🛒 楽天で価格を見る
                </RakutenLink>
              )}
              <p className="mt-1 text-xs text-gray-400">
                気になったらまずカートに入れておくと安心です
              </p>
            </div>
          </div>
        </div>

        {/* スペック表 */}
        <SpecTable product={product} />

        {/* 良い点・注意点 */}
        {(product.ai_good_points || product.ai_bad_points) && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              レビュー分析（AI）
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {product.ai_good_points && product.ai_good_points.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-800">
                    👍 良い点
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {product.ai_good_points.map((point, i) => (
                      <li key={i}>・{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.ai_bad_points && product.ai_bad_points.length > 0 && (
                <div className="rounded-lg bg-orange-50 p-4">
                  <h3 className="mb-2 font-semibold text-orange-800">
                    ⚠️ 注意点
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {product.ai_bad_points.map((point, i) => (
                      <li key={i}>・{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* おすすめ対象 */}
        {product.ai_recommend_for && product.ai_recommend_for.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              ✅ この商品が向いている人
            </h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {product.ai_recommend_for.map((item, i) => (
                <li key={i}>・{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* レビュー要約 */}
        {product.ai_review_summary && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              📝 レビュー要約
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {product.ai_review_summary}
            </p>
          </section>
        )}

        {/* 最下部CTA */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center">
          {product.affiliate_url && (
            <RakutenLink
              url={product.affiliate_url}
              productId={product.id}
              source="detail_bottom"
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
            >
              🛒 楽天で価格を見る
            </RakutenLink>
          )}
          <p className="mt-2 text-xs text-gray-500">
            カートに入れれば89日以内の購入でOK。まずはカートへ！
          </p>
        </div>
      </div>

      {/* 構造化データ: Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.item_name,
            description: product.ai_summary || product.item_name,
            image: product.image_urls?.[0],
            brand: product.brand
              ? { "@type": "Brand", name: product.brand }
              : undefined,
            offers: {
              "@type": "Offer",
              price: product.item_price,
              priceCurrency: "JPY",
              availability: "https://schema.org/InStock",
              url: product.affiliate_url || product.item_url,
            },
            ...(product.review_count > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.review_average,
                    reviewCount: product.review_count,
                  },
                }
              : {}),
          }),
        }}
      />
    </div>
  );
}
