import type { Concept, Tag } from "@/types/word";
import { MAX_TAGS_PER_WORD, REGISTRY_TAGS } from "@/lib/constants";

const VALID_TAGS = new Set<Tag>(REGISTRY_TAGS);

export interface ValidationIssue {
  type: "duplicate" | "missing_category" | "invalid_tag" | "too_many_tags" | "broken_antonym" | "empty_words";
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
      if (w.tags.length > MAX_TAGS_PER_WORD) {
        issues.push({
          type: "too_many_tags",
          message: `Too many tags in "${c.english}" (${w.tags.length}/${MAX_TAGS_PER_WORD})`,
        });
      }
      for (const tag of w.tags) {
        if (!VALID_TAGS.has(tag)) {
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
