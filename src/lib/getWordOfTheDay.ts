import type { Concept } from "@/types/word";

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getWordOfTheDay(concepts: Concept[]): Concept | null {
  if (concepts.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const index = hashDate(today) % concepts.length;
  return concepts[index];
}
