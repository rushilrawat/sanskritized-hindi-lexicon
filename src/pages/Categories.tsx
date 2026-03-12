import { useState, useMemo, useEffect, useRef } from "react";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import CategoryGrid from "@/components/CategoryGrid";
import WordCard from "@/components/WordCard";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import { useTranslation } from "@/hooks/useTranslation";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const BATCH_SIZE = 50;

const Categories = () => {
  const { concepts, loading } = useWords();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, [concepts]);

  const filtered = useMemo(() => {
    let list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));
    if (selectedCategory) {
      list = list.filter((c) => c.category === selectedCategory);
    }
    return list;
  }, [selectedCategory, concepts]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((c) => Math.min(c + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const visibleItems = filtered.slice(0, visibleCount);

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const handleJumpToLetter = (letter: string) => {
    const targetIndex = filtered.findIndex(
      (c) => c.english[0].toUpperCase() === letter
    );
    if (targetIndex >= 0 && targetIndex >= visibleCount) {
      setVisibleCount(Math.min(targetIndex + BATCH_SIZE, filtered.length));
      requestAnimationFrame(() => {
        const el = document.getElementById(`cat-word-${letter}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      const el = document.getElementById(`cat-word-${letter}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const lettersRendered = new Set<string>();

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  return (
    <div className="container-page">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">
        {t("categories.title", "Browse by Category")}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-8">
        {t("categories.subtitle", "Explore vocabulary grouped by thematic categories.")}
      </p>

      <div className="mb-4 sm:mb-6">
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          showCounts
        />
      </div>

      {filtered.length > 5 && (
        <section className="my-6">
          <div className="flex flex-wrap gap-1 justify-center">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleJumpToLetter(letter)}
                disabled={!availableLetters.has(letter)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[10px] sm:text-xs font-medium transition-colors ${
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

      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {selectedCategory && (
          <h2 className="text-base sm:text-lg font-semibold text-foreground">{selectedCategory}</h2>
        )}
        {visibleItems.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div key={concept.english} id={needsAnchor ? `cat-word-${firstLetter}` : undefined}>
              <WordCard concept={concept} />
            </div>
          );
        })}
        
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="py-4 text-center text-sm text-muted-foreground">
            {t("index.loadingMore", "Loading more…")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
