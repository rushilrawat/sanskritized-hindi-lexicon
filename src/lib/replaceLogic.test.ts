import { describe, expect, it } from "vitest";
import type { Concept } from "@/types/word";
import { buildReplacementMap, normalizeFullStops, replaceSentenceWithHighlights } from "@/lib/replaceLogic";

const concepts: Concept[] = [
  {
    english: "court",
    category: "Law",
    description: "A place where legal cases are heard.",
    sanskrit_derived: [
      { dev: "न्यायालय", roman: "nyaayaalay", ipa: "njaːjaːləj", tags: ["formal"] },
      { dev: "अदालत-परिषद्", roman: "adaalat-parishad", ipa: "ədəːlət pərɪʂəd", tags: ["formal"] },
    ],
    other_historical_sources: [
      { dev: "अदालत", roman: "adaalat", ipa: "ədəːlət", tags: ["colloquial"] },
    ],
  },
];

describe("replaceLogic", () => {
  it("replaces whole-word Devanagari matches and normalizes adjacent full stops", () => {
    const map = buildReplacementMap(concepts);
    const normalized = normalizeFullStops("अदालत में बात.");
    const result = replaceSentenceWithHighlights(normalized, map);

    expect(result.text).toBe("न्यायालय में बात।");
    expect(result.replacements).toEqual([
      {
        original: "अदालत",
        replacement: "न्यायालय",
        conceptEnglish: "court",
        synonyms: ["अदालत-परिषद्"],
      },
    ]);
  });

  it("preserves roman output for roman input", () => {
    const map = buildReplacementMap(concepts);
    const result = replaceSentenceWithHighlights("adaalat record", map);

    expect(result.text).toBe("nyaayaalay record");
    expect(result.replacements[0].synonyms).toEqual(["adaalat-parishad"]);
  });

  it("does not replace inside longer words", () => {
    const map = buildReplacementMap(concepts);
    const result = replaceSentenceWithHighlights("xadaalaty adaalat", map);

    expect(result.text).toBe("xadaalaty nyaayaalay");
  });
});
