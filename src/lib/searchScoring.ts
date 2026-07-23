/**
 * Centralised, tweakable weights and helpers for the lexicon search.
 *
 * Weights live in one place so ranking stays consistent across queries
 * and can be tuned without touching the search loop.
 */

import type { Concept, WordEntry } from "@/types/word";

export const SEARCH_WEIGHTS = {
  exact: 1000,
  prefix: 500,
  wordBoundary: 200,
  substring: 100,
  fuzzyBase: 80,
  fuzzyEditPenalty: 25,
  // Multiplier applied when the matched field is in the same script as the query.
  scriptBoost: 1.5,
  // Multiplier applied to matches found via the concat-no-space needle ("pre m" → premium).
  concatPenalty: 0.65,
  // Length penalty (per extra char) for prefix matches.
  prefixLenPenalty: 1,
  // Light penalty per index offset for substring matches.
  substringIdxPenalty: 1,
  substringLenPenalty: 0.1,
} as const;

export type Script = "dev" | "ipa" | "roman";

const DEV_RE = /[\u0900-\u097F]/;
// IPA-distinguishing characters (rough — enough to separate from plain roman).
const IPA_RE = /[ɑəɪʊɛɔŋɲʃʒθðʌɒæːɖʈɳɽɸɣχˈˌ]/;

export function detectScript(s: string): Script {
  if (DEV_RE.test(s)) return "dev";
  if (IPA_RE.test(s)) return "ipa";
  return "roman";
}

export function normalizeQuery(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Bounded Levenshtein distance with early exit. */
export function editDistance(a: string, b: string, maxDist: number): number {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export const fuzzyBudget = (len: number) => (len >= 7 ? 2 : len >= 4 ? 1 : 0);

export interface SearchSuggestion {
  concept: Concept;
  entry: WordEntry;
}

const normalizeForDistance = (value: string, script: Script) => {
  const normalized = script === "dev" ? value.trim() : normalizeQuery(value);
  return normalized.replace(/^\/+|\/+$/g, "").replace(/\s+/g, " ");
};

const commonPrefixLength = (a: string, b: string) => {
  const limit = Math.min(a.length, b.length);
  let length = 0;
  while (length < limit && a[length] === b[length]) length += 1;
  return length;
};

/**
 * Finds the lexicon entry nearest to a query that produced no search results.
 * Matching stays within the detected script so the three suggested forms all
 * belong to one useful entry rather than serving a fixed example.
 */
export function findClosestSearchSuggestion(
  concepts: Concept[],
  rawQuery: string
): SearchSuggestion | null {
  const queryScript = detectScript(rawQuery);
  const query = normalizeForDistance(rawQuery, queryScript);
  if (!query || concepts.length === 0) return null;

  let best: {
    concept: Concept;
    entry: WordEntry;
    score: number;
    prefixLength: number;
    priority: number;
  } | null = null;

  const consider = (concept: Concept, entry: WordEntry, value: string, priority: number) => {
    const candidate = normalizeForDistance(value, queryScript);
    if (!candidate) return;

    const distance = editDistance(query, candidate, Math.max(query.length, candidate.length));
    const score = distance / Math.max(query.length, candidate.length, 1);
    const prefixLength = commonPrefixLength(query, candidate);
    if (
      !best ||
      score < best.score ||
      (score === best.score && prefixLength > best.prefixLength) ||
      (score === best.score && prefixLength === best.prefixLength && priority < best.priority) ||
      (score === best.score && prefixLength === best.prefixLength && priority === best.priority && concept.english.localeCompare(best.concept.english) < 0)
    ) {
      best = { concept, entry, score, prefixLength, priority };
    }
  };

  for (const concept of concepts) {
    const entries = [...concept.sanskrit_derived, ...concept.other_historical_sources];
    const fallbackEntry = entries[0];
    if (!fallbackEntry) continue;

    if (queryScript === "roman") {
      consider(concept, fallbackEntry, concept.english, 0);
    }

    entries.forEach((entry, index) => {
      const value = queryScript === "dev" ? entry.dev : queryScript === "ipa" ? entry.ipa : entry.roman;
      consider(concept, entry, value, index + 1);
    });
  }

  return best ? { concept: best.concept, entry: best.entry } : null;
}
