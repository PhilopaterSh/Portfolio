import { describe, expect, it } from "vitest";
import { calculateEntropy } from "../utils/passwordEntropy";

describe("calculateEntropy", () => {
  it("returns 0 for an empty password", () => {
    expect(calculateEntropy("")).toBe(0);
  });

  it("uses a 26-char pool for lowercase-only passwords", () => {
    // log2(26) * 8 ≈ 37.6
    expect(calculateEntropy("abcdefgh")).toBeCloseTo(37.6, 1);
  });

  it("grows the pool as more character classes are used", () => {
    const lower = calculateEntropy("aaaaaaaa");
    const lowerUpper = calculateEntropy("aaaaaaaA");
    const lowerUpperDigit = calculateEntropy("aaaaaaA1");
    const allClasses = calculateEntropy("aaaaaaA1!");

    expect(lowerUpper).toBeGreaterThan(lower);
    expect(lowerUpperDigit).toBeGreaterThan(lowerUpper);
    expect(allClasses).toBeGreaterThan(lowerUpperDigit);
  });

  it("scales linearly with password length for a fixed pool", () => {
    const eight = calculateEntropy("aaaaaaaa");
    const sixteen = calculateEntropy("aaaaaaaaaaaaaaaa");
    expect(sixteen).toBeCloseTo(eight * 2, 1);
  });
});
