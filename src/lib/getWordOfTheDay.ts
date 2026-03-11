import type { Concept } from "@/types/word";

/**
 * Simple hash to get a deterministic but well-distributed number from a seed.
 */
function simpleHash(seed: number): number {
  let h = seed * 2654435761;
  h = ((h >>> 16) ^ h) * 0x45d9f3b;
  h = ((h >>> 16) ^ h) * 0x45d9f3b;
  h = (h >>> 16) ^ h;
  return Math.abs(h);
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const NO_REPEAT_DAYS = 14;

export function getWordOfTheDay(concepts: Concept[]): Concept | null {
  if (concepts.length === 0) return null;

  const today = dayOfYear(new Date());
  const year = new Date().getFullYear();

  // Collect indices used in the last 14 days (excluding today)
  const recentIndices = new Set<number>();
  for (let d = 1; d <= NO_REPEAT_DAYS; d++) {
    const pastDay = today - d;
    const pastSeed = pastDay >= 0 ? year * 1000 + pastDay : (year - 1) * 1000 + (365 + pastDay);
    recentIndices.add(simpleHash(pastSeed) % concepts.length);
  }

  // Pick today's candidate; if it collides with a recent one, shift forward
  const baseSeed = year * 1000 + today;
  let index = simpleHash(baseSeed) % concepts.length;
  let attempts = 0;
  while (recentIndices.has(index) && attempts < concepts.length) {
    index = (index + 1) % concepts.length;
    attempts++;
  }

  return concepts[index];
}
