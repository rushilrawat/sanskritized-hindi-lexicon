import { useState, useRef, useEffect, forwardRef } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchBarProps {
  onSearch: (query: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
}

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={resolvedPlaceholder}
        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all font-body text-xs sm:text-sm"
      />
    </div>
  );
};

export default SearchBar;
