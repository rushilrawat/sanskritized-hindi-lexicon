import type { Concept } from "@/types/word";

export interface ReplacementMap {
  from: string;
  to: string;
  toRoman: string;
}

export interface TextSegment {
  text: string;
  replaced: boolean;
}

export function buildReplacementMap(concepts: Concept[]): ReplacementMap[] {
  const map: ReplacementMap[] = [];
  for (const concept of concepts) {
    if (concept.sanskrit_derived.length === 0) continue;
    const targetDev = concept.sanskrit_derived[0].dev;
    const targetRoman = concept.sanskrit_derived[0].roman;
    for (const other of concept.other_historical_sources) {
      map.push({ from: other.dev, to: targetDev, toRoman: targetRoman });
      if (other.roman) {
        map.push({ from: other.roman, to: targetDev, toRoman: targetRoman });
      }
    }
  }
  // Sort by length descending to avoid partial matches
  map.sort((a, b) => b.from.length - a.from.length);
  return map;
}

// Detect if a string is primarily Devanagari
function isDevanagari(s: string): boolean {
  const devChars = s.match(/[\u0900-\u097F]/g);
  return !!devChars && devChars.length > s.length / 3;
}

// Check if a character is a word boundary for matching purposes
function isWordBoundary(char: string | undefined): boolean {
  if (!char) return true; // start/end of string
  // Spaces, punctuation, etc.
  return /[\s.,;:!?'"()\[\]{}\-\/\\|@#$%^&*+=<>~`]/.test(char);
}

export function replaceSentence(text: string, map: ReplacementMap[]): string {
  // Split into words, replace whole tokens only
  const words = text.split(/(\s+)/);
  return words.map(word => {
    if (/^\s+$/.test(word)) return word;
    for (const { from, to, toRoman } of map) {
      if (word === from) {
        return isDevanagari(from) ? to : toRoman;
      }
    }
    return word;
  }).join("");
}

export function replaceSentenceWithHighlights(
  text: string,
  map: ReplacementMap[]
): { text: string; segments: TextSegment[] } {
  interface Match {
    start: number;
    end: number;
    to: string;
  }
  const matches: Match[] = [];

  for (const { from, to, toRoman } of map) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Use word boundary approach: check chars before/after match
    const regex = new RegExp(escaped, "g");
    const target = isDevanagari(from) ? to : toRoman;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const start = m.index;
      const end = start + from.length;
      // Only match whole words: check boundaries
      const charBefore = start > 0 ? text[start - 1] : undefined;
      const charAfter = end < text.length ? text[end] : undefined;
      if (!isWordBoundary(charBefore) || !isWordBoundary(charAfter)) continue;
      const overlaps = matches.some(
        (existing) => start < existing.end && end > existing.start
      );
      if (!overlaps) {
        matches.push({ start, end, to: target });
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  let resultText = "";

  for (const match of matches) {
    if (match.start > cursor) {
      const plain = text.slice(cursor, match.start);
      segments.push({ text: plain, replaced: false });
      resultText += plain;
    }
    segments.push({ text: match.to, replaced: true });
    resultText += match.to;
    cursor = match.end;
  }

  if (cursor < text.length) {
    const rest = text.slice(cursor);
    segments.push({ text: rest, replaced: false });
    resultText += rest;
  }

  return { text: resultText, segments };
}
