import { describe, expect, it } from "vitest";
import { getAllRouteMetadata, getRouteMetadata } from "./routeMetadata";

describe("route metadata", () => {
  it("returns distinct, populated metadata for each supported path", () => {
    const routes = getAllRouteMetadata();
    expect(routes.map((route) => route.path)).toEqual([
      "/",
      "/Resume/",
      "/Cybersecurity_Awareness/",
    ]);
    expect(new Set(routes.map((route) => route.title)).size).toBe(routes.length);
    expect(routes.every((route) => route.description.trim().length > 0)).toBe(true);
    expect(
      routes.every((route) =>
        route.canonicalUrl.startsWith("https://philopatersh.github.io/Portfolio/"),
      ),
    ).toBe(true);
  });

  it.each([
    ["/", "/"],
    ["/Portfolio/Resume", "/Resume/"],
    ["/Portfolio/Resume/", "/Resume/"],
    ["/Cybersecurity_Awareness/", "/Cybersecurity_Awareness/"],
  ])("resolves %s to %s", (input, expectedPath) => {
    expect(getRouteMetadata(input)?.path).toBe(expectedPath);
  });

  it("returns null for unsupported routes", () => {
    expect(getRouteMetadata("/Portfolio/unknown/")).toBeNull();
  });
});
