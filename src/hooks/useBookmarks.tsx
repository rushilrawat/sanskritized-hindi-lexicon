import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "learn-bookmarks";

interface BookmarksContextValue {
  bookmarks: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
}

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined);

export const bookmarkId = (english: string, dev: string) => `${english}|${dev}`;

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b !== id));
  }, []);

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, removeBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider");
  return ctx;
};
