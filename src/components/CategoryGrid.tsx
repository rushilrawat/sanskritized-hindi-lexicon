interface CategoryGridProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const categoryEmojis: Record<string, string> = {
  "Education": "📚",
  "Emotion": "💖",
  "Geography": "🌍",
  "Governance": "🏛️",
  "Law": "⚖️",
  "Nature": "🌿",
  "Relationships": "🤝",
  "Relationship": "🤝",
  "Abstract Concepts": "💭",
  "Body & Health": "🏥",
  "Society": "👥",
  "Occupations": "💼",
};

const CategoryGrid = ({ categories, selectedCategory, onSelect }: CategoryGridProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
        }`}
      >
        📖 All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
            selectedCategory === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
          }`}
        >
          {categoryEmojis[cat] || "📝"} {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
