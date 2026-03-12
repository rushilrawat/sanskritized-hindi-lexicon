import type { Concept } from "@/types/word";

export interface ReplacementMap {
  from: string;
  to: string;
  toRoman: string;
  toIpa: string;
  fromIsIpa: boolean;
  conceptEnglish: string;
  synonyms: string[];
}

export interface TextSegment {
  text: string;
  replaced: boolean;
  original?: string;
  conceptEnglish?: string;
}

export interface ReplacementDetail {
  original: string;
  replacement: string;
  conceptEnglish: string;
  synonyms: string[];
}

export function buildReplacementMap(concepts: Concept[]): ReplacementMap[] {
  const map: ReplacementMap[] = [];
  for (const concept of concepts) {
    if (concept.sanskrit_derived.length === 0) continue;
    const targetDev = concept.sanskrit_derived[0].dev;
    const targetRoman = concept.sanskrit_derived[0].roman;
    const targetIpa = concept.sanskrit_derived[0].ipa;
    const synonyms = concept.sanskrit_derived.length > 1
      ? concept.sanskrit_derived.slice(1).map(s => s.dev)
      : [];
    const synonymsRoman = concept.sanskrit_derived.length > 1
      ? concept.sanskrit_derived.slice(1).map(s => s.roman)
      : [];
    const synonymsIpa = concept.sanskrit_derived.length > 1
      ? concept.sanskrit_derived.slice(1).map(s => s.ipa)
      : [];
    for (const other of concept.other_historical_sources) {
      map.push({ from: other.dev, to: targetDev, toRoman: targetRoman, toIpa: targetIpa, fromIsIpa: false, conceptEnglish: concept.english, synonyms });
      if (other.roman) {
        map.push({ from: other.roman, to: targetDev, toRoman: targetRoman, toIpa: targetIpa, fromIsIpa: false, conceptEnglish: concept.english, synonyms: synonymsRoman });
      }
      if (other.ipa) {
        map.push({ from: other.ipa, to: targetDev, toRoman: targetRoman, toIpa: targetIpa, fromIsIpa: true, conceptEnglish: concept.english, synonyms: synonymsIpa });
      }
    }
  }
  map.sort((a, b) => b.from.length - a.from.length);
  return map;
}

function isDevanagari(s: string): boolean {
  const devChars = s.match(/[\u0900-\u097F]/g);
  return !!devChars && devChars.length > s.length / 3;
}

function isWordBoundary(char: string | undefined): boolean {
  if (!char) return true;
  return /[\s.,;:!?'"()\[\]{}\-\/\\|@#$%^&*+=<>~`]/.test(char);
}

export function replaceSentence(text: string, map: ReplacementMap[]): string {
  const words = text.split(/(\s+)/);
  return words.map(word => {
    if (/^\s+$/.test(word)) return word;
    for (const { from, to, toRoman, toIpa, fromIsIpa } of map) {
      if (word === from) {
        if (fromIsIpa) return toIpa;
        return isDevanagari(from) ? to : toRoman;
      }
    }
    return word;
  }).join("");
}

export function replaceSentenceWithHighlights(
  text: string,
  map: ReplacementMap[]
): { text: string; segments: TextSegment[]; replacements: ReplacementDetail[] } {
  interface Match {
    start: number;
    end: number;
    to: string;
    original: string;
    conceptEnglish: string;
    synonyms: string[];
  }
  const matches: Match[] = [];

  for (const { from, to, toRoman, toIpa, fromIsIpa, conceptEnglish, synonyms } of map) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    const target = fromIsIpa ? toIpa : (isDevanagari(from) ? to : toRoman);
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const start = m.index;
      const end = start + from.length;
      const charBefore = start > 0 ? text[start - 1] : undefined;
      const charAfter = end < text.length ? text[end] : undefined;
      if (!isWordBoundary(charBefore) || !isWordBoundary(charAfter)) continue;
      const overlaps = matches.some(
        (existing) => start < existing.end && end > existing.start
      );
      if (!overlaps) {
        matches.push({ start, end, to: target, original: from, conceptEnglish, synonyms });
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  let resultText = "";
  const seenReplacements = new Map<string, ReplacementDetail>();

  for (const match of matches) {
    if (match.start > cursor) {
      const plain = text.slice(cursor, match.start);
      segments.push({ text: plain, replaced: false });
      resultText += plain;
    }
    segments.push({ text: match.to, replaced: true, original: match.original, conceptEnglish: match.conceptEnglish });
    resultText += match.to;
    cursor = match.end;

    const key = match.original + "→" + match.to;
    if (!seenReplacements.has(key)) {
      seenReplacements.set(key, {
        original: match.original,
        replacement: match.to,
        conceptEnglish: match.conceptEnglish,
      });
    }
  }

  if (cursor < text.length) {
    const rest = text.slice(cursor);
    segments.push({ text: rest, replaced: false });
    resultText += rest;
  }

  return { text: resultText, segments, replacements: Array.from(seenReplacements.values()) };
}