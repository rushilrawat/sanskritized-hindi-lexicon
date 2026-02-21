interface CategoryGridProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const CategoryGrid = ({ categories, selectedCategory, onSelect }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
          selectedCategory === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
            selectedCategory === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
