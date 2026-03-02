import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import SearchBar from "@/components/SearchBar";
import WordOfTheDay from "@/components/WordOfTheDay";
import WordCard from "@/components/WordCard";
import AnimatedHeading from "@/components/AnimatedHeading";
import { getWordOfTheDay } from "@/lib/getWordOfTheDay";
import DataFallback from "@/components/DataFallback";

const concepts = Array.isArray(wordsData) ? (wordsData as Concept[]) : [];

function normalize(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BATCH_SIZE = 50;

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearch(q);
    } else {
      setSearch("");
    }
  }, [searchParams, location.key]);

  const wotd = useMemo(() => getWordOfTheDay(concepts), []);

  const filtered = useMemo(() => {
    let list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));

    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((c) => {
        if (normalize(c.english).includes(q)) return true;
        for (const w of [...c.sanskrit_derived, ...c.other_historical_sources]) {
          if (w.dev.includes(search.trim()) || normalize(w.roman).includes(q)) return true;
        }
        return false;
      });
    }

    return list;
  }, [search]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filtered]);

  // Infinite scroll observer
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

  // Track current letter on scroll
  useEffect(() => {
    if (search || !listRef.current) return;

    const handleScroll = () => {
      const letters = listRef.current?.querySelectorAll("[data-letter]");
      if (!letters) return;
      let current: string | null = null;
      for (const el of letters) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          current = (el as HTMLElement).dataset.letter || null;
        }
      }
      setActiveLetter(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [search]);

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const handleJumpToLetter = useCallback((letter: string) => {
    // Find the index of the first word starting with this letter
    const idx = filtered.findIndex(
      (c) => c.english[0].toUpperCase() === letter
    );
    if (idx === -1) return;

    // Ensure enough items are loaded to include this letter
    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + BATCH_SIZE, filtered.length));
      // Wait for render, then scroll
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

  // Group words by first letter for anchors
  const lettersRendered = new Set<string>();
  const visibleItems = filtered.slice(0, visibleCount);

  if (concepts.length === 0) {
    return <DataFallback message="No word data found. The lexicon data file may be empty or malformed." />;
  }

  return (
    <div className="container-page">
      {/* Hero */}
      <section className="text-center mb-10 pt-6">
        <AnimatedHeading />
        <p className="text-muted-foreground max-w-lg mx-auto">
          A structured, etymology-based reference of Sanskrit-derived Hindi vocabulary.
        </p>
      </section>

      {/* Search - Sticky */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 mb-5">
        <SearchBar onSearch={setSearch} autoFocus initialValue={search} />
      </section>

      {/* Word of the Day */}
      {wotd && !search && (
        <section className="mb-10">
          <WordOfTheDay concept={wotd} onViewEntry={handleViewWotdEntry} />
        </section>
      )}

      {/* A-Z Jump Navigation */}
      {!search && filtered.length > 5 && (
        <section className="mb-6">
          <div className="flex flex-wrap gap-1 justify-center">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleJumpToLetter(letter)}
                  disabled={!isAvailable}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                      : isAvailable
                        ? "text-foreground hover:bg-primary hover:text-primary-foreground border border-border"
                        : "text-muted-foreground/30 cursor-default"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          {activeLetter && (
            <p className="text-center text-xs text-primary font-medium mt-2">
              Currently viewing: {activeLetter}
            </p>
          )}
        </section>
      )}

      {/* Word List */}
      <section className="space-y-5" ref={listRef}>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No entries found. Try another term.</p>
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
        {/* Sentinel for infinite scroll */}
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="flex justify-center py-6">
            <span className="text-sm text-muted-foreground animate-pulse">Loading more…</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
