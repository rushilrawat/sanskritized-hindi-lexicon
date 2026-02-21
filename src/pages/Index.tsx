import { useState, useMemo, useCallback } from "react";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import SearchBar from "@/components/SearchBar";
import WordOfTheDay from "@/components/WordOfTheDay";
import WordCard from "@/components/WordCard";
import CategoryGrid from "@/components/CategoryGrid";
import AnimatedHeading from "@/components/AnimatedHeading";
import { getWordOfTheDay } from "@/lib/getWordOfTheDay";

const concepts = wordsData as Concept[];

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, []);

  const wotd = useMemo(() => getWordOfTheDay(concepts), []);

  const filtered = useMemo(() => {
    let list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));

    if (selectedCategory) {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        if (c.english.toLowerCase().includes(q)) return true;
        for (const w of [...c.sanskrit_derived, ...c.other_historical_sources]) {
          if (w.dev.includes(q) || w.roman.toLowerCase().includes(q)) return true;
        }
        return false;
      });
    }

    return list;
  }, [search, selectedCategory]);

  const handleViewWotdEntry = useCallback(() => {
    if (wotd) {
      setSearch(wotd.english);
      setSelectedCategory(null);
    }
  }, [wotd]);

  return (
    <div className="container-page">
      {/* Hero */}
      <section className="text-center mb-10">
        <AnimatedHeading />
        <p className="text-muted-foreground max-w-lg mx-auto">
          A structured, etymology-based reference of Sanskrit-derived Hindi vocabulary.
        </p>
      </section>

      {/* Search */}
      <section className="mb-8">
        <SearchBar onSearch={setSearch} autoFocus />
      </section>

      {/* Word of the Day */}
      {wotd && !search && !selectedCategory && (
        <section className="mb-10">
          <WordOfTheDay concept={wotd} onViewEntry={handleViewWotdEntry} />
        </section>
      )}

      {/* Category Filter */}
      <section className="mb-8">
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* Word List */}
      <section className="space-y-5">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No entries found.</p>
        )}
        {filtered.map((concept) => (
          <WordCard key={concept.english} concept={concept} />
        ))}
      </section>
    </div>
  );
};

export default Index;
