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
  "Abstract Concepts": { glyph: "💭", label: "Principles" },
  "Body & Health": { glyph: "🏥", label: "Body" },
  Education: { glyph: "📚", label: "Learning" },
  Emotion: { glyph: "💖", label: "Feeling" },
  Geography: { glyph: "🌍", label: "Earth" },
  Governance: { glyph: "🏛️", label: "Statecraft" },
  Law: { glyph: "⚖️", label: "Justice" },
  Nature: { glyph: "🌿", label: "Nature" },
  Occupations: { glyph: "💼", label: "Work" },
  Relationships: { glyph: "🤝", label: "Relation" },
  Society: { glyph: "👥", label: "People" },
};
