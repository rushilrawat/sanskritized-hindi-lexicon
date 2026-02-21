import type { Concept, WordEntry } from "@/types/word";

export interface FlatWord extends WordEntry {
  english: string;
  source: "sanskrit_derived" | "other_historical_sources";
}

export function flattenWords(concepts: Concept[]): FlatWord[] {
  const flat: FlatWord[] = [];
  for (const concept of concepts) {
    for (const w of concept.sanskrit_derived) {
      flat.push({ ...w, english: concept.english, source: "sanskrit_derived" });
    }
    for (const w of concept.other_historical_sources) {
      flat.push({ ...w, english: concept.english, source: "other_historical_sources" });
    }
  }
  return flat;
}
