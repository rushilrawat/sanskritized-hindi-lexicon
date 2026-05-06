import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import SearchBar from "@/components/SearchBar";
import WordOfTheDay from "@/components/WordOfTheDay";
import WordCard from "@/components/WordCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { getWordOfTheDay } from "@/lib/getWordOfTheDay";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import { useTranslation } from "@/hooks/useTranslation";

function normalize(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BATCH_SIZE = 50;

const Index = () => {
  const { concepts, loading } = useWords();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearch(q);
    } else {
      setSearch("");
    }
  }, [searchParams, location.key]);

  const wotd = useMemo(() => getWordOfTheDay(concepts), [concepts]);

  const filtered = useMemo(() => {
    let list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));

    if (search.trim()) {
      const raw = search.trim();
      const q = normalize(raw);

      // Bounded Levenshtein distance (early-exit when exceeding maxDist).
      const editDistance = (a: string, b: string, maxDist: number): number => {
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
            curr[j] = Math.min(
              prev[j] + 1,
              curr[j - 1] + 1,
              prev[j - 1] + cost
            );
            if (curr[j] < rowMin) rowMin = curr[j];
          }
          if (rowMin > maxDist) return maxDist + 1;
          [prev, curr] = [curr, prev];
        }
        return prev[n];
      };

      // Allow 1 edit for queries length 4-6, 2 edits for 7+. Shorter queries: exact only.
      const fuzzyBudget = (len: number) => (len >= 7 ? 2 : len >= 4 ? 1 : 0);

      const scoreString = (s: string, isDev = false): number => {
        const hay = isDev ? s : normalize(s);
        const needle = isDev ? raw : q;
        if (!hay || !needle) return 0;
        if (hay === needle) return 1000;
        if (hay.startsWith(needle)) return 500 - (hay.length - needle.length);
        const idx = hay.indexOf(needle);
        if (idx !== -1) {
          const prev = hay[idx - 1];
          const boundary = idx === 0 || /\s|[-_/]/.test(prev || "");
          return (boundary ? 200 : 100) - idx - (hay.length - needle.length) * 0.1;
        }
        // Fuzzy: small typo tolerance against the whole haystack or its
        // best-matching window. Skip for Devanagari (different char set logic).
        if (isDev) return 0;
        const budget = fuzzyBudget(needle.length);
        if (budget === 0) return 0;
        // Whole-string distance
        let bestDist = editDistance(hay, needle, budget);
        // Sliding-window over hay for substring-like fuzzy matches
        if (bestDist > budget && hay.length > needle.length) {
          const winLen = needle.length;
          for (let i = 0; i + winLen <= hay.length; i++) {
            const d = editDistance(hay.slice(i, i + winLen), needle, budget);
            if (d < bestDist) bestDist = d;
            if (bestDist === 0) break;
          }
        }
        if (bestDist > budget) return 0;
        // Lower than substring (100) so exact/substring matches still win.
        return 80 - bestDist * 25;
      };

      const scored: { c: Concept; score: number }[] = [];
      for (const c of list) {
        let best = scoreString(c.english);
        for (const w of [...c.sanskrit_derived, ...c.other_historical_sources]) {
          best = Math.max(best, scoreString(w.dev, true));
          best = Math.max(best, scoreString(w.roman));
          best = Math.max(best, scoreString(w.ipa));
        }
        if (best > 0) scored.push({ c, score: best });
      }
      scored.sort((a, b) => b.score - a.score || a.c.english.localeCompare(b.c.english));
      list = scored.map((s) => s.c);
    }

    return list;
  }, [search, concepts]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filtered]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  useEffect(() => {
    if (search) {
      setActiveLetter(null);
      return;
    }

    const handleScroll = () => {
      const letters = document.querySelectorAll("[data-letter]");
      if (!letters.length) return;
      // Threshold = bottom of sticky search/alphabet bar (approx)
      const threshold = 240;
      let current: string | null = null;
      for (const el of letters) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= threshold) {
          current = (el as HTMLElement).dataset.letter || null;
        } else {
          break;
        }
      }
      setActiveLetter(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [search, visibleCount, filtered.length]);

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const handleJumpToLetter = useCallback((letter: string) => {
    const idx = filtered.findIndex(
      (c) => c.english[0].toUpperCase() === letter
    );
    if (idx === -1) return;

    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + BATCH_SIZE, filtered.length));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`word-${letter}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else {
      const el = document.getElementById(`word-${letter}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filtered, visibleCount]);

  const handleViewWotdEntry = useCallback(() => {
    if (wotd) {
      setSearch(wotd.english);
      setSearchParams({ search: wotd.english });
    }
  }, [wotd, setSearchParams]);

  const lettersRendered = new Set<string>();
  const visibleItems = filtered.slice(0, visibleCount);

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback message={t("index.noData", "No word data found. The lexicon data file may be empty or malformed.")} />;
  }

  return (
    <div className="container-page">
      <section className="text-center mb-6 sm:mb-10 pt-4 sm:pt-6">
        <AnimatedHeading />
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          {t("index.subtitle", "A structured, etymology-based reference of Sanskrit-derived Hindi vocabulary.")}
        </p>
      </section>

      <section className="sticky top-[85px] md:top-14 z-20 bg-background border-b border-border py-2 sm:py-3 -mx-4 px-4">
        <SearchBar onSearch={setSearch} autoFocus initialValue={search} />
        {!search && filtered.length > 5 && (
          <div className="flex gap-px sm:gap-0.5 justify-center items-center mt-2">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleJumpToLetter(letter)}
                  disabled={!isAvailable}
                  className={`w-[calc((100%-25px)/26)] sm:w-6 h-6 flex-shrink-0 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isAvailable
                        ? "text-foreground hover:bg-primary hover:text-primary-foreground"
                        : "text-muted-foreground/30 cursor-default"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {wotd && !search && (
        <section className="mb-6 mt-4">
          <WordOfTheDay concept={wotd} onViewEntry={handleViewWotdEntry} />
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("index.allEntries", "All Entries")}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </section>
      )}

      <section className="space-y-3 sm:space-y-5" ref={listRef}>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {t("index.noEntries", "No entries found. Try another term.")}
          </p>
        )}
        {visibleItems.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div
              key={concept.english}
              id={needsAnchor ? `word-${firstLetter}` : undefined}
              data-letter={needsAnchor ? firstLetter : undefined}
            >
              <WordCard concept={concept} />
            </div>
          );
        })}
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="flex justify-center py-6">
            <span className="text-sm text-muted-foreground animate-pulse">
              {t("index.loadingMore", "Loading more…")}
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
