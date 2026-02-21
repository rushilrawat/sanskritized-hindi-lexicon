import type { Concept } from "@/types/word";

export interface ReplacementMap {
  from: string;
  to: string;
}

export function buildReplacementMap(concepts: Concept[]): ReplacementMap[] {
  const map: ReplacementMap[] = [];
  for (const concept of concepts) {
    if (concept.sanskrit_derived.length === 0) continue;
    const target = concept.sanskrit_derived[0].dev;
    for (const other of concept.other_historical_sources) {
      map.push({ from: other.dev, to: target });
    }
  }
  // Sort by length descending to avoid partial matches
  map.sort((a, b) => b.from.length - a.from.length);
  return map;
}

export function replaceSentence(text: string, map: ReplacementMap[]): string {
  let result = text;
  for (const { from, to } of map) {
    // Use global replace for all occurrences
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    result = result.replace(regex, to);
  }
  return result;
}
