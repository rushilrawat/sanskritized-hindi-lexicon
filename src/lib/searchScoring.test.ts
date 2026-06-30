import { describe, expect, it } from "vitest";
import { detectScript, editDistance, fuzzyBudget, normalizeQuery } from "@/lib/searchScoring";

describe("searchScoring", () => {
  it("normalizes case and roman diacritics", () => {
    expect(normalizeQuery("  Rājyābhiṣek  ")).toBe("rajyabhisek");
  });

  it("detects Devanagari, IPA, and roman scripts", () => {
    expect(detectScript("धर्म")).toBe("dev");
    expect(detectScript("d̪ʱəɾm")).toBe("ipa");
    expect(detectScript("dharma")).toBe("roman");
  });

  it("bounds edit distance by the requested maximum", () => {
    expect(editDistance("nyaya", "nyaay", 2)).toBe(2);
    expect(editDistance("governance", "raj", 2)).toBe(3);
  });

  it("uses a conservative fuzzy budget", () => {
    expect(fuzzyBudget(3)).toBe(0);
    expect(fuzzyBudget(4)).toBe(1);
    expect(fuzzyBudget(7)).toBe(2);
  });
});
