import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "plant-light.jpのプライバシーポリシーについて。",
  alternates: {
    canonical: "https://plant-light.jp/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-green-700 hover:underline"
      >
        ← トップに戻る
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          プライバシーポリシー
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              運営者情報
            </h2>
            <p>
              当サイト「plant-light.jp」（以下「当サイト」）は、植物育成ライトに関する情報提供を目的とした個人運営のウェブサイトです。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              個人情報の取得について
            </h2>
            <p>
              当サイトでは、お問い合わせの際にメールアドレス等の個人情報をいただく場合があります。取得した個人情報は、お問い合わせへの回答にのみ使用し、それ以外の目的では使用いたしません。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              アクセス解析ツールについて
            </h2>
            <p>
              当サイトでは、Googleによるアクセス解析ツール「Google
              Analytics」を使用する場合があります。Google
              Analyticsはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
            </p>
            <p className="mt-2">
              この機能はCookieを無効にすることで収集を拒否することができます。お使いのブラウザの設定をご確認ください。Google
              Analyticsの利用規約については、Google
              Analyticsの公式サイトをご参照ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              広告・アフィリエイトについて
            </h2>
            <p>
              当サイトは、楽天アフィリエイトプログラムに参加しています。当サイト内のリンクを通じて商品を購入された場合、当サイト運営者に紹介料が支払われることがあります。
            </p>
            <p className="mt-2">
              商品の紹介にあたっては、スペック情報やレビューを基に客観的な情報提供を心がけておりますが、アフィリエイトリンクを含む場合があることをご了承ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              免責事項
            </h2>
            <p>
              当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねます。情報の正確性には万全を期していますが、商品の価格・仕様・在庫状況等は変更される場合があります。最新情報は各販売サイトにてご確認ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              著作権について
            </h2>
            <p>
              当サイトに掲載されている文章・画像等のコンテンツの著作権は、当サイト運営者または正当な権利を有する第三者に帰属します。無断転載・複製は禁止いたします。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-800">
              プライバシーポリシーの変更について
            </h2>
            <p>
              当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本プライバシーポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
            </p>
          </section>

          <p className="mt-4 text-xs text-gray-400">
            制定日: 2026年2月17日
          </p>
        </div>
      </article>
    </div>
  );
}
