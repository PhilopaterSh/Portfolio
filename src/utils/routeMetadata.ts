import routeRecords from "../data/siteMetadata.json";

/** Metadata shared by the page head, generated HTML documents, and sitemap. */
export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  socialImageUrl: string;
  socialImageAlt: string;
}

/** Resolves a supported route or returns null for an unknown URL. */
export function getRouteMetadata(pathname: string): RouteMetadata | null {
  const basePath = "/Portfolio";
  let routePath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  if (!routePath.startsWith("/")) routePath = `/${routePath}`;
  if (routePath !== "/") routePath = `${routePath.replace(/\/+$/, "")}/`;

  return routeRecords.find((record) => record.path === routePath) ?? null;
}

/** Returns the static route records used by generation and consistency checks. */
export function getAllRouteMetadata(): RouteMetadata[] {
  return routeRecords;
}
