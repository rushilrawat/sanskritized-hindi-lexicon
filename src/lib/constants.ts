import type { Tag } from "@/types/word";

export const CATEGORIES = [
  "Abstract Concepts",
  "Body & Health",
  "Education",
  "Emotion",
  "Geography",
  "Governance",
  "Law",
  "Nature",
  "Occupations",
  "Relationships",
  "Society",
] as const;

export type Category = typeof CATEGORIES[number];

export const REGISTRY_TAGS = [
  "formal",
  "colloquial",
  "classical",
  "archaic",
  "literary",
  "religious",
  "philosophical",
  "administrative",
  "legal",
  "academic",
  "technical",
] as const satisfies readonly Tag[];

export type RegistryTag = typeof REGISTRY_TAGS[number];

export const MAX_TAGS_PER_WORD = 2;

export const CATEGORY_META: Record<string, { glyph: string; label: string }> = {
  "Abstract Concepts": { glyph: "तत्त्व", label: "Principles" },
  "Body & Health": { glyph: "देह", label: "Body" },
  Education: { glyph: "विद्या", label: "Learning" },
  Emotion: { glyph: "भाव", label: "Feeling" },
  Geography: { glyph: "भू", label: "Earth" },
  Governance: { glyph: "राज", label: "Statecraft" },
  Law: { glyph: "न्याय", label: "Justice" },
  Nature: { glyph: "प्रकृति", label: "Nature" },
  Occupations: { glyph: "कर्म", label: "Work" },
  Relationships: { glyph: "सम्बन्ध", label: "Relation" },
  Society: { glyph: "लोक", label: "People" },
};
