import { describe, expect, it } from "vitest";
import { searchConcepts } from "@/lib/searchConcepts";
import type { Concept } from "@/types/word";

const concepts: Concept[] = [
  {
    english: "clarity",
    category: "Abstract Concepts",
    description: "The quality of being clear.",
    sanskrit_derived: [{ dev: "स्पष्टता", roman: "spashtataa", ipa: "spəʂʈətaː", tags: ["formal"] }],
    other_historical_sources: [],
  },
  {
    english: "joy",
    category: "Emotion",
    description: "A feeling of happiness.",
    sanskrit_derived: [{ dev: "आनन्द", roman: "aananda", ipa: "aːnənd̪ə", tags: ["formal"] }],
    other_historical_sources: [],
  },
];

describe("searchConcepts", () => {
  it("returns alphabetical concepts without a query", () => {
    expect(searchConcepts([...concepts].reverse(), "").map((concept) => concept.english)).toEqual(["clarity", "joy"]);
  });

  it("ranks a Devanagari match before unrelated concepts", () => {
    expect(searchConcepts(concepts, "स्पष्टता")[0].english).toBe("clarity");
  });
});
