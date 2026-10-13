import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const metadata = JSON.parse(
  await readFile(path.join(projectRoot, "src/data/siteMetadata.json"), "utf8"),
);
const indexPath = path.join(projectRoot, "dist/index.html");
const sitemapPath = path.join(projectRoot, "dist/sitemap.xml");
const template = await readFile(indexPath, "utf8");
const marker = /<!-- ROUTE_METADATA_START -->([\s\S]*?)<!-- ROUTE_METADATA_END -->/g;

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function metadataBlock(route) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = escapeHtml(route.canonicalUrl);
  const image = escapeHtml(route.socialImageUrl);
  const imageAlt = escapeHtml(route.socialImageAlt);

  return [
    "<!-- ROUTE_METADATA_START -->",
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    "<!-- ROUTE_METADATA_END -->",
  ].join("\n    ");
}

const sitemapUrls = metadata
  .map((route) => `  <url>\n    <loc>${escapeHtml(route.canonicalUrl)}</loc>\n  </url>`)
  .join("\n");
await writeFile(
  sitemapPath,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
);

if ((template.match(marker) ?? []).length !== 1) {
  throw new Error("Expected exactly one route metadata block in dist/index.html.");
}

const paths = new Set();
const canonicals = new Set();
for (const route of metadata) {
  if (paths.has(route.path)) throw new Error(`Duplicate route metadata path: ${route.path}`);
  if (canonicals.has(route.canonicalUrl)) {
    throw new Error(`Duplicate canonical URL in route metadata: ${route.canonicalUrl}`);
  }
  paths.add(route.path);
  canonicals.add(route.canonicalUrl);
}

for (const route of metadata) {
  if (route.path === "/") continue;
  if (!/^\/(?:[A-Za-z0-9_-]+\/)+$/.test(route.path)) {
    throw new Error(`Route path must use a leading and trailing slash: ${route.path}`);
  }
  for (const key of ["title", "description", "canonicalUrl", "socialImageUrl", "socialImageAlt"]) {
    if (typeof route[key] !== "string" || !route[key].trim()) {
      throw new Error(`Missing ${key} for route ${route.path}`);
    }
  }
  const canonical = new URL(route.canonicalUrl);
  if (
    canonical.origin !== "https://philopatersh.github.io" ||
    canonical.pathname !== `/Portfolio${route.path}`
  ) {
    throw new Error(
      `Canonical URL does not match the configured project route: ${route.canonicalUrl}`,
    );
  }

  const html = template.replace(marker, metadataBlock(route));
  const outputDir = path.join(projectRoot, "dist", route.path.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html);
}
