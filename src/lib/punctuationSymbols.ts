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
  // Numbers — show Arabic + Devanagari numerals
  "zero": "0 · ०",
  "one": "1 · १",
  "two": "2 · २",
  "three": "3 · ३",
  "four": "4 · ४",
  "five": "5 · ५",
  "six": "6 · ६",
  "seven": "7 · ७",
  "eight": "8 · ८",
  "nine": "9 · ९",
  "ten": "10 · १०",
  "eleven": "11 · ११",
  "twelve": "12 · १२",
  "twenty": "20 · २०",
  "fifty": "50 · ५०",
  "hundred": "100 · १००",
  "thousand": "1,000 · १,०००",
  "lakh": "1,00,000 · १,००,०००",
  "million": "1,000,000 · १०,००,०००",
  "crore": "1,00,00,000 · १,००,००,०००",
};

export function getPunctuationSymbol(english: string): string | undefined {
  return punctuationSymbols[english.toLowerCase()];
}
