import type { Concept } from "@/types/word";
import {
  SEARCH_WEIGHTS,
  detectScript,
  editDistance,
  fuzzyBudget,
  normalizeQuery,
  type Script,
} from "@/lib/searchScoring";

const scoreOnce = (hay: string, needle: string, concatPenalty = 1): number => {
  if (!hay || !needle) return 0;
  if (hay === needle) return SEARCH_WEIGHTS.exact * concatPenalty;
  if (hay.startsWith(needle)) {
    return (SEARCH_WEIGHTS.prefix - (hay.length - needle.length) * SEARCH_WEIGHTS.prefixLenPenalty) * concatPenalty;
  }
  const index = hay.indexOf(needle);
  if (index < 0) return 0;
  const boundary = index === 0 || /\s|[-_/]/.test(hay[index - 1] || "");
  const base = boundary ? SEARCH_WEIGHTS.wordBoundary : SEARCH_WEIGHTS.substring;
  return (
    base -
    index * SEARCH_WEIGHTS.substringIdxPenalty -
    (hay.length - needle.length) * SEARCH_WEIGHTS.substringLenPenalty
  ) * concatPenalty;
};

const scoreFuzzy = (hay: string, needle: string): number => {
  const budget = fuzzyBudget(needle.length);
  if (budget === 0) return 0;
  let bestDistance = editDistance(hay, needle, budget);
  if (bestDistance > budget && hay.length > needle.length) {
    for (let index = 0; index + needle.length <= hay.length; index += 1) {
      bestDistance = Math.min(bestDistance, editDistance(hay.slice(index, index + needle.length), needle, budget));
      if (bestDistance === 0) break;
    }
  }
  return bestDistance <= budget ? SEARCH_WEIGHTS.fuzzyBase - bestDistance * SEARCH_WEIGHTS.fuzzyEditPenalty : 0;
};

export function searchConcepts(concepts: Concept[], rawSearch: string): Concept[] {
  const query = rawSearch.trim();
  const list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));
  if (!query) return list;

  const queryScript: Script = detectScript(query);
  const normalized = normalizeQuery(query);
  const compact = normalized.replace(/\s+/g, "");
  const useConcat = /\s/.test(normalized) && compact.length >= 3;
  const rawCompact = query.replace(/\s+/g, "");

  const scoreString = (value: string, fieldScript: Script): number => {
    if (!value) return 0;
    const hay = fieldScript === "dev" ? value : normalizeQuery(value);
    const needle = fieldScript === "dev" ? query : normalized;
    let score = scoreOnce(hay, needle);
    if (useConcat) {
      score = Math.max(score, scoreOnce(hay, fieldScript === "dev" ? rawCompact : compact, SEARCH_WEIGHTS.concatPenalty));
    }
    if (score === 0 && fieldScript !== "dev") {
      score = scoreFuzzy(hay, needle);
      if (useConcat) score = Math.max(score, scoreFuzzy(hay, compact) * SEARCH_WEIGHTS.concatPenalty);
    }
    return score > 0 && fieldScript === queryScript ? score * SEARCH_WEIGHTS.scriptBoost : score;
  };

  return list
    .map((concept) => {
      let score = scoreString(concept.english, "roman");
      for (const word of [...concept.sanskrit_derived, ...concept.other_historical_sources]) {
        score = Math.max(score, scoreString(word.dev, "dev"));
        score = Math.max(score, scoreString(word.roman, "roman"));
        score = Math.max(score, scoreString(word.ipa, "ipa"));
      }
      return { concept, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.concept.english.localeCompare(b.concept.english))
    .map((item) => item.concept);
}
