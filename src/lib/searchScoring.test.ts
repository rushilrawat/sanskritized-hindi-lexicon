import { describe, expect, it } from "vitest";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import { detectScript, editDistance, findClosestSearchSuggestion, fuzzyBudget, normalizeQuery } from "@/lib/searchScoring";

const concepts: Concept[] = [
  {
    english: "gratitude",
    category: "Emotion",
    description: "The quality of being thankful.",
    sanskrit_derived: [
      { dev: "कृतज्ञता", roman: "kritagyta", ipa: "kr̩t̪əɡjət̪aː", tags: ["formal"] },
    ],
    other_historical_sources: [],
  },
  {
    english: "zeal",
    category: "Emotion",
    description: "Great energy or enthusiasm.",
    sanskrit_derived: [
      { dev: "उत्साह", roman: "utsaah", ipa: "ʊt̪saːh", tags: ["formal"] },
    ],
    other_historical_sources: [],
  },
];

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

  it("suggests forms from the English concept closest to an unmatched query", () => {
    const suggestion = findClosestSearchSuggestion(wordsData as Concept[], "gratuity");

    expect(suggestion?.concept.english).toBe("gratitude");
    expect(suggestion?.entry).toMatchObject({
      dev: "कृतज्ञता",
      roman: "kritagyta",
      ipa: "kr̩t̪əɡjət̪aː",
    });
  });

  it("keeps a Devanagari typo matched to its own multilingual entry", () => {
    const suggestion = findClosestSearchSuggestion(concepts, "उत्सह");

    expect(suggestion?.concept.english).toBe("zeal");
    expect(suggestion?.entry.roman).toBe("utsaah");
  });
});
