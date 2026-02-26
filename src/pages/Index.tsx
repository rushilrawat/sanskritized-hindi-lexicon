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

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const listRef = useRef<HTMLDivElement>(null);
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

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const handleJumpToLetter = (letter: string) => {
    const el = document.getElementById(`word-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewWotdEntry = useCallback(() => {
    if (wotd) {
      setSearch(wotd.english);
      setSearchParams({ search: wotd.english });
    }
  }, [wotd, setSearchParams]);

  // Group words by first letter for anchors
  const lettersRendered = new Set<string>();

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
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleJumpToLetter(letter)}
                disabled={!availableLetters.has(letter)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  availableLetters.has(letter)
                    ? "text-foreground hover:bg-primary hover:text-primary-foreground border border-border"
                    : "text-muted-foreground/30 cursor-default"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Word List */}
      <section className="space-y-5" ref={listRef}>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No entries found. Try another term.</p>
        )}
        {filtered.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div key={concept.english} id={needsAnchor ? `word-${firstLetter}` : undefined}>
              <WordCard concept={concept} />
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Index;
