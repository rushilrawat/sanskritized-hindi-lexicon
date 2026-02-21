export type Tag =
  | "formal"
  | "colloquial"
  | "classical"
  | "archaic"
  | "literary"
  | "religious"
  | "philosophical"
  | "administrative"
  | "legal"
  | "academic"
  | "technical";

export interface WordEntry {
  dev: string;
  roman: string;
  ipa: string;
  tags: Tag[];
}

export interface Concept {
  english: string;
  category: string;
  description: string;
  sanskrit_derived: WordEntry[];
  other_historical_sources: WordEntry[];
}
