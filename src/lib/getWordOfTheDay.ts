import type { Concept } from "@/types/word";

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getWordOfTheDay(concepts: Concept[]): Concept | null {
  if (concepts.length === 0) return null;
  const index = dayOfYear(new Date()) % concepts.length;
  return concepts[index];
}
