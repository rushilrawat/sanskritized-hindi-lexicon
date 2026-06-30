import { describe, expect, it } from "vitest";
import type { Concept } from "@/types/word";
import { validateWords } from "@/lib/validateWords";

const baseConcept: Concept = {
  english: "order",
  category: "Abstract Concepts",
  description: "A settled arrangement.",
  sanskrit_derived: [{ dev: "व्यवस्था", roman: "vyavastha", ipa: "ʋjəʋəst̪ʰaː", tags: ["formal"] }],
  other_historical_sources: [],
};

describe("validateWords", () => {
  it("reports duplicate keys, invalid tags, too many tags, broken antonyms, and empty entries", () => {
    const concepts: Concept[] = [
      baseConcept,
      {
        ...baseConcept,
        english: "Order",
        category: "",
        sanskrit_derived: [
          {
            dev: "क्रम",
            roman: "kram",
            ipa: "kɾəm",
            tags: ["formal", "classical", "poetic" as never],
          },
        ],
        antonyms: ["chaos"],
      },
      {
        english: "empty",
        category: "Abstract Concepts",
        description: "No entries.",
        sanskrit_derived: [],
        other_historical_sources: [],
      },
    ];

    const issueTypes = validateWords(concepts).map((issue) => issue.type);

    expect(issueTypes).toContain("duplicate");
    expect(issueTypes).toContain("missing_category");
    expect(issueTypes).toContain("invalid_tag");
    expect(issueTypes).toContain("too_many_tags");
    expect(issueTypes).toContain("broken_antonym");
    expect(issueTypes).toContain("empty_words");
  });
});
