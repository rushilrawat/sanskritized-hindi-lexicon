import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";

const concepts = wordsData as Concept[];

const categoryEmojis: Record<string, string> = {
  Education: "📚",
  Emotion: "💖",
  Geography: "🌍",
  Governance: "🏛️",
  Law: "⚖️",
  Nature: "🌿",
  Relationships: "🤝",
  Relationship: "🤝",
  "Abstract Concepts": "💭",
  "Body & Health": "🏥",
  Society: "👥",
  Occupations: "💼",
};

interface CategoryGridProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  showCounts?: boolean;
}

const CategoryGrid = ({ categories, selectedCategory, onSelect, showCounts = false }: CategoryGridProps) => {
  const getCategoryCount = (cat: string) =>
    concepts.filter((c) => c.category === cat).length;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
        }`}
      >
        📋 All{showCounts && <span className="ml-1 text-xs opacity-70">({concepts.length})</span>}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap ${
            selectedCategory === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
          }`}
        >
          {categoryEmojis[cat] || "📁"} {cat}
          {showCounts && <span className="ml-1 text-xs opacity-70">({getCategoryCount(cat)})</span>}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
