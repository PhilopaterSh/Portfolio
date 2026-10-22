import { describe, expect, it } from "vitest";
import metadata from "./siteMetadata.json";
import sitemap from "../../public/sitemap.xml?raw";

describe("site metadata manifest", () => {
  it("contains unique supported route paths and titles", () => {
    const paths = metadata.map((route) => route.path);
    const titles = metadata.map((route) => route.title);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toEqual(["/", "/Resume/", "/Cybersecurity_Awareness/"]);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("provides descriptions, absolute canonical URLs, and social image text", () => {
    for (const route of metadata) {
      expect(route.description.trim()).not.toBe("");
      expect(new URL(route.canonicalUrl).origin).toBe("https://philopatersh.github.io");
      expect(route.canonicalUrl).toContain("/Portfolio/");
      expect(new URL(route.socialImageUrl).protocol).toBe("https:");
      expect(route.socialImageAlt.trim()).not.toBe("");
    }
  });

  it("keeps sitemap locations in the canonical manifest route order", () => {
    expect(metadata.map((route) => route.canonicalUrl)).toEqual(
      [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
    );
  });
});
