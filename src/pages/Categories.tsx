import { useState, useMemo } from "react";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import CategoryGrid from "@/components/CategoryGrid";
import WordCard from "@/components/WordCard";

const concepts = wordsData as Concept[];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, []);

  const filtered = useMemo(() => {
    if (!selectedCategory) return [];
    return concepts
      .filter((c) => c.category === selectedCategory)
      .sort((a, b) => a.english.localeCompare(b.english));
  }, [selectedCategory]);

  return (
    <div className="container-page">
      <h1 className="text-2xl font-bold text-foreground mb-2">Browse by Category</h1>
      <p className="text-muted-foreground mb-8">
        Explore vocabulary grouped by thematic categories.
      </p>

      <div className="sticky top-14 z-40 bg-background py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {selectedCategory && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{selectedCategory}</h2>
          {filtered.map((concept) => (
            <WordCard key={concept.english} concept={concept} />
          ))}
        </div>
      )}

      {!selectedCategory && (
        <p className="text-center text-muted-foreground py-12">
          Select a category above to view entries.
        </p>
      )}
    </div>
  );
};

export default Categories;
