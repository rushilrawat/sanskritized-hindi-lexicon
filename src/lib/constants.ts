// Centralized categories and registry tags.
// Keep in sync with the dataset (src/data/words.json) and validator (src/lib/validateWords.ts).

export const CATEGORIES = [
  "everyday",
  "emotions",
  "nature",
  "society",
  "abstract",
  "actions",
  "objects",
  "people",
  "time",
  "place",
  "punctuation",
] as const;

export type Category = typeof CATEGORIES[number];

export const REGISTRY_TAGS = [
  "classical",
  "literary",
  "formal",
  "colloquial",
  "informal",
  "archaic",
  "technical",
  "religious",
  "poetic",
  "neologism",
] as const;

export type RegistryTag = typeof REGISTRY_TAGS[number];

export const MAX_TAGS_PER_WORD = 2;
