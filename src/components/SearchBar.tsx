import { useState, useRef, useEffect, forwardRef } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchBarProps {
  onSearch: (query: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
}

const MAX_SEARCH_LENGTH = 200;
const DEBOUNCE_MS = 120;

const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(({ onSearch, autoFocus = false, placeholder, initialValue = "" }, ref) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const resolvedPlaceholder = placeholder || t("search.placeholder", "Search by English, Devanagari, or IPA...");

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounce search callback to avoid filtering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => onSearch(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.slice(0, MAX_SEARCH_LENGTH));
  };

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        maxLength={MAX_SEARCH_LENGTH}
        autoComplete="off"
        spellCheck={false}
        aria-label={resolvedPlaceholder}
        placeholder={resolvedPlaceholder}
        className="archive-search font-body"
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
