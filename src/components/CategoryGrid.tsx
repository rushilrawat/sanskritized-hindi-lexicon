import { useWords } from "@/hooks/useWords";
import { useTranslation } from "@/hooks/useTranslation";
import { CATEGORY_META } from "@/lib/constants";

interface CategoryGridProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  showCounts?: boolean;
}

const CategoryGrid = ({ categories, selectedCategory, onSelect, showCounts = false }: CategoryGridProps) => {
  const { concepts } = useWords();
  const { t, n } = useTranslation();

  const counts = concepts.reduce<Record<string, number>>((acc, concept) => {
    acc[concept.category] = (acc[concept.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`archive-chip ${selectedCategory === null ? "archive-chip-active" : ""}`}
      >
        <span className="archive-chip-glyph" aria-hidden="true">सर्व</span>
        <span>{t("categories.all", "All")}</span>
        {showCounts && <span className="archive-chip-count">({n(concepts.length)})</span>}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`archive-chip ${selectedCategory === cat ? "archive-chip-active" : ""}`}
        >
          <span className="archive-chip-glyph" aria-hidden="true">{CATEGORY_META[cat]?.glyph || "पद"}</span>
          <span>{t(`category.${cat}`, cat)}</span>
          {showCounts && <span className="archive-chip-count">({n(counts[cat] || 0)})</span>}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
