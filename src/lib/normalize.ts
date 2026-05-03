/**
 * Normalization helpers for romanization and IPA strings.
 *
 * Goals:
 * - Produce a consistent "preview" form for transliteration (ISO-15919-ish
 *   diacritic style) and IPA (NFC-normalized, slash-wrapped) so users can
 *   see a cleaner canonical reading alongside the raw stored value.
 *
 * These helpers do NOT mutate the dataset; they only compute a display value.
 */

/** Normalize an IPA string for display: NFC, trim, collapse whitespace. */
export function normalizeIpa(ipa: string): string {
  return ipa.normalize("NFC").replace(/\s+/g, " ").trim();
}

/**
 * Convert ad-hoc romanization (e.g. "raajyatyaag", "sveekaar") to a
 * diacritic-based preview (e.g. "rājyatyāg", "svīkār").
 *
 * This is heuristic and intentionally conservative — it only rewrites
 * unambiguous long-vowel digraphs. The original `roman` is preserved as the
 * primary value; the normalized form is shown as a secondary preview.
 */
export function normalizeRoman(roman: string): string {
  let v = roman.normalize("NFC").toLowerCase().trim();
  // Long vowels: aa → ā, ee → ī, oo → ū (common ad-hoc conventions)
  v = v.replace(/aa/g, "ā");
  v = v.replace(/ee/g, "ī");
  v = v.replace(/oo/g, "ū");
  // Retroflex/aspirate digraphs are left alone: sh, ch, th, dh, gh, bh, ph, kh
  // because rewriting them risks ambiguity (e.g. "th" in compounds).
  return v;
}

/** True if the normalized form differs meaningfully from the raw input. */
export function hasNormalization(raw: string, normalized: string): boolean {
  return raw.trim().toLowerCase() !== normalized.trim().toLowerCase();
}
