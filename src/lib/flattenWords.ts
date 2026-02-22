import type { Concept, WordEntry } from "@/types/word";

export interface FlatWord extends WordEntry {
  english: string;
  category: string;
  source: "sanskrit_derived" | "other_historical_sources";
  synonyms: string[];
}

export function flattenWords(
  concepts: Concept[],
  sourceFilter?: "sanskrit_derived" | "other_historical_sources"
): FlatWord[] {
  const flat: FlatWord[] = [];
  for (const concept of concepts) {
    if (!sourceFilter || sourceFilter === "sanskrit_derived") {
      const sanskritDevs = concept.sanskrit_derived.map((w) => w.dev);
      for (const w of concept.sanskrit_derived) {
        flat.push({
          ...w,
          english: concept.english,
          category: concept.category,
          source: "sanskrit_derived",
          synonyms: sanskritDevs.filter((d) => d !== w.dev),
        });
      }
    }
    if (!sourceFilter || sourceFilter === "other_historical_sources") {
      for (const w of concept.other_historical_sources) {
        flat.push({
          ...w,
          english: concept.english,
          category: concept.category,
          source: "other_historical_sources",
          synonyms: [],
        });
      }
    }
  }
  return flat;
}
