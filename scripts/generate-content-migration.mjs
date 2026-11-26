import fs from "fs";

const blogModule = await import("../src/data/blog.ts");
const newsModule = await import("../src/data/news.ts");

const blogArticles = blogModule.blogArticles;
const newsArticles = newsModule.newsArticles;

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";

  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  if (value === null || value === undefined) return "NULL";

  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlBoolean(value) {
  return value ? "true" : "false";
}

function sqlDate(value) {
  if (!value) return "NULL";

  return `${sqlString(value)}::timestamptz`;
}

function postInsert(article, type) {
  const isBlog = type === "BLOG";

  const authorName = article.author?.name ?? null;
  const authorRole = article.author?.role ?? null;
  const authorImageUrl = article.author?.image ?? null;

  const contentText = Array.isArray(article.content)
    ? article.content
        .map((block) => {
          if (block.type === "list") {
            return block.items.join("\n");
          }

          return block.text ?? "";
        })
        .filter(Boolean)
        .join("\n\n")
    : "";

  const conclusion = isBlog ? article.conclusion ?? [] : null;
  const tags = isBlog ? article.tags ?? [] : null;
  const ctaLabel = isBlog ? article.cta?.label ?? null : null;
  const ctaHref = isBlog ? article.cta?.href ?? null : null;

  return `
INSERT INTO content.posts (
  slug,
  title,
  subtitle,
  excerpt,
  content,
  cover_image_url,
  author_name,
  author_role,
  author_image_url,
  image_alt,
  content_blocks,
  conclusion,
  cta_label,
  cta_href,
  seo_title,
  seo_description,
  tags,
  is_featured,
  status,
  published_at,
  post_type
)
VALUES (
  ${sqlString(article.slug)},
  ${sqlString(article.title)},
  ${sqlString(article.subtitle ?? null)},
  ${sqlString(article.excerpt)},
  ${sqlString(contentText)},
  ${sqlString(article.image)},
  ${sqlString(authorName)},
  ${sqlString(authorRole)},
  ${sqlString(authorImageUrl)},
  ${sqlString(article.imageAlt)},
  ${sqlJson(article.content)},
  ${sqlJson(conclusion)},
  ${sqlString(ctaLabel)},
  ${sqlString(ctaHref)},
  ${sqlString(article.seo?.title ?? article.title)},
  ${sqlString(article.seo?.description ?? article.excerpt)},
  ${sqlJson(tags)},
  ${sqlBoolean(article.featured)},
  'PUBLISHED',
  ${sqlDate(article.publishedAt ?? null)},
  '${type}'
)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_url = EXCLUDED.cover_image_url,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_image_url = EXCLUDED.author_image_url,
  image_alt = EXCLUDED.image_alt,
  content_blocks = EXCLUDED.content_blocks,
  conclusion = EXCLUDED.conclusion,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  post_type = EXCLUDED.post_type,
  updated_at = now();
`;
}

function categorySlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryInsert(name) {
  return `
INSERT INTO content.post_categories (
  name,
  slug,
  is_active
)
VALUES (
  ${sqlString(name)},
  ${sqlString(categorySlug(name))},
  true
)
ON CONFLICT (name)
DO UPDATE SET
  is_active = true;
`;
}

function relationInsert(article) {
  return `
INSERT INTO content.post_category_relations (
  post_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM content.posts p
JOIN content.post_categories c
  ON lower(c.name) = lower(${sqlString(article.category)})
WHERE p.slug = ${sqlString(article.slug)}
ON CONFLICT (post_id, category_id)
DO NOTHING;
`;
}

function tagSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tagInsert(name) {
  return `
INSERT INTO content.post_tags (
  name,
  slug
)
VALUES (
  ${sqlString(name)},
  ${sqlString(tagSlug(name))}
)
ON CONFLICT (name)
DO UPDATE SET
  slug = EXCLUDED.slug;
`;
}

function tagRelationInsert(article) {
  if (!article.tags?.length) return "";

  return article.tags
    .map(
      (tag) => `
INSERT INTO content.post_tag_relations (
  post_id,
  tag_id
)
SELECT
  p.id,
  t.id
FROM content.posts p
JOIN content.post_tags t
  ON lower(t.name) = lower(${sqlString(tag)})
WHERE p.slug = ${sqlString(article.slug)}
ON CONFLICT (post_id, tag_id)
DO NOTHING;
`
    )
    .join("\n");
}

const allArticles = [
  ...blogArticles.map((article) => ({ ...article, _type: "BLOG" })),
  ...newsArticles.map((article) => ({ ...article, _type: "NEWS" })),
];

const categories = [
  ...new Set(allArticles.map((article) => article.category).filter(Boolean)),
];

const tags = [
  ...new Set(
    blogArticles
      .flatMap((article) => article.tags ?? [])
      .filter(Boolean)
  ),
];

let sql = `-- ============================================================================
-- MIGRACIÓN AUTOMÁTICA BLOG + NEWS
-- Generada desde src/data/blog.ts y src/data/news.ts
-- NO ejecutar sin revisar.
-- ============================================================================

BEGIN;

`;

for (const category of categories) {
  sql += categoryInsert(category);
}

sql += "\n";

for (const tag of tags) {
  sql += tagInsert(tag);
}

sql += "\n";

for (const article of allArticles) {
  sql += postInsert(article, article._type);
}

sql += "\n";

for (const article of allArticles) {
  sql += relationInsert(article);
}

sql += "\n";

for (const article of blogArticles) {
  sql += tagRelationInsert(article);
}

sql += `
COMMIT;
`;

const output = "database/migrations/011_seed_blog_news_content.sql";

fs.writeFileSync(output, sql, "utf8");

console.log("========================================");
console.log("MIGRACIÓN SQL GENERADA");
console.log("========================================");
console.log(`Blog:       ${blogArticles.length}`);
console.log(`Noticias:   ${newsArticles.length}`);
console.log(`Total:      ${allArticles.length}`);
console.log(`Categorías: ${categories.length}`);
console.log(`Tags:       ${tags.length}`);
console.log("");
console.log(`Archivo: ${output}`);
console.log("");
console.log("NO SE MODIFICÓ POSTGRESQL.");
console.log("========================================");