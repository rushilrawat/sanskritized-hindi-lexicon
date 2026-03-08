import { useState, useMemo } from "react";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import CategoryGrid from "@/components/CategoryGrid";
import WordCard from "@/components/WordCard";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Categories = () => {
  const { concepts, loading } = useWords();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const handleJumpToLetter = (letter: string) => {
    const el = document.getElementById(`cat-word-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lettersRendered = new Set<string>();

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  return (
    <div className="container-page">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Browse by Category</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-8">
        Explore vocabulary grouped by thematic categories.
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
        {filtered.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div key={concept.english} id={needsAnchor ? `cat-word-${firstLetter}` : undefined}>
              <WordCard concept={concept} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
