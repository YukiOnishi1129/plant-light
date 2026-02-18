/**
 * ビルド前データ準備スクリプト
 * R2のParquetファイルをダウンロードしてJSONに変換
 *
 * 出力: .cache/data/*.json
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readParquet } from "parquet-wasm";
import { tableFromIPC } from "apache-arrow";

// .env.local を手動で読み込む
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=");
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// R2の公開ドメイン
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";
if (!R2_PUBLIC_DOMAIN) {
  console.error("ERROR: R2_PUBLIC_DOMAIN environment variable is required");
  process.exit(1);
}

const CACHE_DIR = join(__dirname, "../.cache/data");

/**
 * ParquetファイルをR2からダウンロードしてパースする
 */
async function fetchParquet(filename) {
  const url = `${R2_PUBLIC_DOMAIN}/parquet/${filename}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  // parquet-wasmでParquetを読み込み、IPC形式に変換
  const wasmTable = readParquet(new Uint8Array(buffer));
  const ipcBuffer = wasmTable.intoIPCStream();

  // apache-arrowでIPCを読み込み
  const arrowTable = tableFromIPC(ipcBuffer);

  const rows = [];

  for (let i = 0; i < arrowTable.numRows; i++) {
    const row = {};
    for (const field of arrowTable.schema.fields) {
      const column = arrowTable.getChild(field.name);
      if (column) {
        let value = column.get(i);
        if (typeof value === "bigint") {
          value = Number(value);
        }
        if (
          typeof value === "string" &&
          (value.startsWith("[") || value.startsWith("{"))
        ) {
          try {
            value = JSON.parse(value);
          } catch {
            // パース失敗時はそのまま
          }
        }
        row[field.name] = value;
      }
    }
    rows.push(row);
  }

  return rows;
}

async function main() {
  console.log("=== Prebuild Data: Fetching from R2 Parquet ===");

  mkdirSync(CACHE_DIR, { recursive: true });

  const files = [
    "products.parquet",
    "guides.parquet",
    "knowledge.parquet",
  ];

  const bigIntReplacer = (_key, value) => {
    if (typeof value === "bigint") {
      return Number(value);
    }
    return value;
  };

  for (const file of files) {
    try {
      const data = await fetchParquet(file);
      const jsonFile = file.replace(".parquet", ".json");
      const outputPath = join(CACHE_DIR, jsonFile);
      writeFileSync(outputPath, JSON.stringify(data, bigIntReplacer), "utf-8");
      console.log(`  ${file} -> ${jsonFile} (${data.length} rows)`);
    } catch (error) {
      console.warn(`  ${file}: ${error.message}`);
      const jsonFile = file.replace(".parquet", ".json");
      const outputPath = join(CACHE_DIR, jsonFile);
      writeFileSync(outputPath, "[]", "utf-8");
    }
  }

  // sitemap.xml 生成
  generateSitemap();

  console.log("=== Prebuild Data: Complete ===");
}

function generateSitemap() {
  const SITE_URL = "https://plant-light.jp";
  const now = new Date().toISOString().split("T")[0];

  // キャッシュからデータ読み込み
  const readCache = (name) => {
    const p = join(CACHE_DIR, name);
    if (!existsSync(p)) return [];
    return JSON.parse(readFileSync(p, "utf-8"));
  };

  const products = readCache("products.json");
  const guides = readCache("guides.json");
  const knowledge = readCache("knowledge.json");

  const urls = [
    `  <url><loc>${SITE_URL}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${SITE_URL}/privacy</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>`,
  ];

  for (const g of guides) {
    const mod = g.updated_at ? g.updated_at.split(" ")[0] : now;
    urls.push(`  <url><loc>${SITE_URL}/guide/${g.slug}</loc><lastmod>${mod}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`);
  }

  for (const a of knowledge) {
    const mod = a.updated_at ? a.updated_at.split(" ")[0] : now;
    urls.push(`  <url><loc>${SITE_URL}/knowledge/${a.slug}</loc><lastmod>${mod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  }

  for (const p of products) {
    const mod = p.updated_at ? p.updated_at.split(" ")[0] : now;
    urls.push(`  <url><loc>${SITE_URL}/products/${p.id}</loc><lastmod>${mod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  const sitemapPath = join(__dirname, "../public/sitemap.xml");
  writeFileSync(sitemapPath, xml, "utf-8");
  console.log(`  sitemap.xml generated (${urls.length} URLs)`);
}

main().catch(console.error);
