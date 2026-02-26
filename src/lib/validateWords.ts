import type { Concept, Tag } from "@/types/word";

const VALID_TAGS: Tag[] = [
  "formal", "colloquial", "classical", "archaic", "literary",
  "religious", "philosophical", "administrative", "legal", "academic", "technical",
];

export interface ValidationIssue {
  type: "duplicate" | "missing_category" | "invalid_tag" | "broken_antonym" | "empty_words";
  message: string;
}

export function validateWords(concepts: Concept[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  const englishKeys = new Set(concepts.map((c) => c.english.toLowerCase()));

  for (const c of concepts) {
    const key = c.english.toLowerCase();

    if (seen.has(key)) {
      issues.push({ type: "duplicate", message: `Duplicate english key: "${c.english}"` });
    }
    seen.add(key);

    if (!c.category?.trim()) {
      issues.push({ type: "missing_category", message: `Missing category for "${c.english}"` });
    }

    if (c.sanskrit_derived.length === 0 && c.other_historical_sources.length === 0) {
      issues.push({ type: "empty_words", message: `No word entries for "${c.english}"` });
    }

    for (const w of [...c.sanskrit_derived, ...c.other_historical_sources]) {
      for (const tag of w.tags) {
        if (!VALID_TAGS.includes(tag)) {
          issues.push({ type: "invalid_tag", message: `Invalid tag "${tag}" in "${c.english}"` });
        }
      }
    }

    if (c.antonyms) {
      for (const ant of c.antonyms) {
        if (!englishKeys.has(ant.toLowerCase())) {
          issues.push({ type: "broken_antonym", message: `Broken antonym ref "${ant}" in "${c.english}"` });
        }
      }
    }
  }

  return issues;
}
