/**
 * Maps a concept's English key to the visible punctuation glyph,
 * so punctuation entries can render the actual mark next to the word.
 */
export const punctuationSymbols: Record<string, string> = {
  "full stop": "।",
  "comma": ",",
  "colon": ":",
  "semicolon": ";",
  "question mark": "?",
  "exclamation mark": "!",
  "quotation mark": "“ ”",
  "hyphen": "-",
  "dash": "—",
  "apostrophe": "'",
  "parenthesis": "( )",
  "bracket": "[ ]",
  "ellipsis": "…",
  "double danda": "॥",
};

export function getPunctuationSymbol(english: string): string | undefined {
  return punctuationSymbols[english.toLowerCase()];
}
