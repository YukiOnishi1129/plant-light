import {
  getKnowledgeArticles,
  getKnowledgeBySlug,
  getProductById,
} from "@/lib/data-loader";
import type { Metadata } from "next";
import type { KnowledgeArticle } from "@/lib/data-loader";
import Link from "next/link";
import { RakutenLink } from "@/components/rakuten-link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getKnowledgeBySlug(slug);
  if (!article) return {};

  const title = article.title;
  const description = article.summary
    ? article.summary.slice(0, 120) + "…"
    : `${article.topic}について詳しく解説。植物育成ライトの基礎知識を初心者向けにわかりやすく紹介します。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://plant-light.jp/knowledge/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://plant-light.jp/knowledge/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const articles = await getKnowledgeArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

async function RelatedProductCard({ productId }: { productId: number }) {
  const product = await getProductById(productId);
  if (!product) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
          {product.image_urls && product.image_urls[0] ? (
            <img
              src={product.image_urls[0]}
              alt={product.item_name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl">
              🌱
            </div>
          )}
        </div>
        <div className="flex-1">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-semibold text-gray-900 hover:text-green-700"
          >
            {product.item_name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold text-red-600">
              {formatPrice(product.item_price)}
            </span>
            {product.ppfd && (
              <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                PPFD: {product.ppfd}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2">
        {product.affiliate_url ? (
          <RakutenLink
            url={product.affiliate_url}
            productId={product.id}
            source="knowledge"
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
  );
}

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getKnowledgeBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-green-700 hover:underline"
      >
        ← トップに戻る
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-1 text-sm text-green-600">{article.topic}</div>
        <h1 className="mb-2 text-2xl font-bold text-green-900">
          {article.title}
        </h1>

        {/* サマリー */}
        {article.summary && (
          <section className="mt-4">
            <div className="rounded-lg bg-green-50 p-5">
              <p className="leading-relaxed text-gray-700">
                {article.summary}
              </p>
            </div>
          </section>
        )}

        {/* 本文 */}
        {article.body && (
          <section className="mt-6">
            <div className="prose prose-green max-w-none">
              {article.body.split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="mb-3 mt-8 text-lg font-bold text-gray-800"
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("**") && block.endsWith("**")) {
                  return (
                    <p key={i} className="mb-2 font-semibold text-gray-800">
                      {block.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                // リスト項目
                if (block.includes("\n- ")) {
                  const lines = block.split("\n");
                  const heading = lines[0].startsWith("- ") ? null : lines[0];
                  const items = lines.filter((l) => l.startsWith("- "));
                  return (
                    <div key={i} className="mb-3">
                      {heading && (
                        <p className="mb-2 font-semibold text-gray-800">
                          {heading.replace(/\*\*/g, "")}
                        </p>
                      )}
                      <ul className="ml-4 list-disc space-y-1 text-gray-700">
                        {items.map((item, j) => (
                          <li key={j}>{item.replace(/^- /, "").replace(/\*\*/g, "")}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return (
                  <p
                    key={i}
                    className="mb-3 leading-relaxed text-gray-700"
                  >
                    {block}
                  </p>
                );
              })}
            </div>
          </section>
        )}

        {/* 関連商品 */}
        {article.related_products && article.related_products.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              関連する商品
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {article.related_products.map((productId) => (
                <RelatedProductCard key={productId} productId={productId} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {article.faq && article.faq.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-gray-800">
              よくある質問
            </h2>
            <div className="space-y-3">
              {article.faq.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800">
                    Q. {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* 構造化データ: Article + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary || "",
            url: `https://plant-light.jp/knowledge/${slug}`,
            publisher: {
              "@type": "Organization",
              name: "plant-light.jp",
            },
          }),
        }}
      />
      {article.faq && article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
