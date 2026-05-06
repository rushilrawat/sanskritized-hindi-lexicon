/**
 * Centralised, tweakable weights and helpers for the lexicon search.
 *
 * Weights live in one place so ranking stays consistent across queries
 * and can be tuned without touching the search loop.
 */

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
