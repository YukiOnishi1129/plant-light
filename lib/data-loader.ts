/**
 * データローダー
 *
 * prebuild-data.mjsで生成されたJSONキャッシュからデータを読み込む。
 * ビルド時に一度だけ読み込んでメモリにキャッシュする。
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache/data");

let productsCache: Product[] | null = null;
let guidesCache: Guide[] | null = null;
let knowledgeCache: KnowledgeArticle[] | null = null;

// =============================================
// Products
// =============================================

export interface Product {
  id: number;
  item_code: string;
  item_name: string;
  item_price: number;
  item_url: string | null;
  affiliate_url: string | null;
  shop_name: string | null;
  shop_code: string | null;
  shop_url: string | null;
  image_urls: string[] | null;
  review_count: number;
  review_average: number;
  genre_id: string | null;
  item_caption: string | null;
  availability: number;
  tax_flag: number;
  sale_price: number | null;
  ranking: number | null;

  // スクレイピング情報
  breadcrumbs: string[] | null;
  description_text: string | null;
  scraped_specs: Record<string, string>[] | null;
  scraped_reviews: ScrapedReview[] | null;
  scraped_review_count: number | null;
  scraped_review_average: number | null;
  is_scraped: number;
  scraped_at: string | null;

  // AI加工情報
  wattage: string | null;
  spectrum: string | null;
  color_temp: string | null;
  timer: string | null;
  socket_type: string | null;
  ppfd: string | null;
  lux: string | null;
  lifespan: string | null;
  dimming: string | null;
  size: string | null;
  ai_summary: string | null;
  ai_good_points: string[] | null;
  ai_bad_points: string[] | null;
  ai_recommend_for: string[] | null;
  ai_review_summary: string | null;
  categories: string[] | null;
  use_tags: string[] | null;
  is_enriched: number;
  enriched_at: string | null;

  // v2追加
  brand: string | null;
  form_factor: string | null;
  ai_matching_plants: string[] | null;

  created_at: string;
  updated_at: string;
}

export interface ScrapedReview {
  rating: number;
  title: string;
  text: string;
  date: string;
  author: string;
}

// =============================================
// Guides
// =============================================

export interface GuideRecommendedProduct {
  product_id: number;
  reason: string;
  target: string;
}

export interface GuideRequiredSpecs {
  ppfd_range: string;
  color_temp: string;
  daily_hours: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface Guide {
  id: number;
  slug: string;
  plant_name: string;
  title: string;
  intro: string | null;
  required_specs: GuideRequiredSpecs | null;
  recommended_products: GuideRecommendedProduct[] | null;
  setup_tips: string | null;
  faq: GuideFAQ[] | null;
  is_generated: number;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// Knowledge Articles
// =============================================

export interface KnowledgeFAQ {
  question: string;
  answer: string;
}

export interface KnowledgeArticle {
  id: number;
  slug: string;
  topic: string;
  title: string;
  summary: string | null;
  body: string | null;
  faq: KnowledgeFAQ[] | null;
  related_products: number[] | null;
  is_generated: number;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// Loader
// =============================================

function loadJson<T>(filename: string): T[] {
  const filePath = join(CACHE_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`Cache file not found: ${filePath}`);
    return [];
  }
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T[];
}

// --- Products ---

export async function getProducts(): Promise<Product[]> {
  if (productsCache === null) {
    productsCache = loadJson<Product>("products.json");
    console.log(`Loaded ${productsCache.length} products from cache`);
  }
  return productsCache;
}

export async function getEnrichedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_enriched === 1);
}

export async function getProductById(
  id: number
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const products = await getEnrichedProducts();
  return products.filter(
    (p) => p.categories && p.categories.includes(category)
  );
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = await getEnrichedProducts();
  return products.filter((p) => p.use_tags && p.use_tags.includes(tag));
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const products = await getEnrichedProducts();
  return products.filter(
    (p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase()
  );
}

export async function getProductsByFormFactor(
  formFactor: string
): Promise<Product[]> {
  const products = await getEnrichedProducts();
  return products.filter((p) => p.form_factor === formFactor);
}

// --- Guides ---

export async function getGuides(): Promise<Guide[]> {
  if (guidesCache === null) {
    guidesCache = loadJson<Guide>("guides.json");
    console.log(`Loaded ${guidesCache.length} guides from cache`);
  }
  return guidesCache;
}

export async function getGuideBySlug(
  slug: string
): Promise<Guide | undefined> {
  const guides = await getGuides();
  return guides.find((g) => g.slug === slug);
}

// --- Knowledge Articles ---

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  if (knowledgeCache === null) {
    knowledgeCache = loadJson<KnowledgeArticle>("knowledge.json");
    console.log(`Loaded ${knowledgeCache.length} knowledge articles from cache`);
  }
  return knowledgeCache;
}

export async function getKnowledgeBySlug(
  slug: string
): Promise<KnowledgeArticle | undefined> {
  const articles = await getKnowledgeArticles();
  return articles.find((a) => a.slug === slug);
}

export function clearCache(): void {
  productsCache = null;
  guidesCache = null;
  knowledgeCache = null;
}
