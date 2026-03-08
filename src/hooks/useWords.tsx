import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Concept } from "@/types/word";

interface WordsContextType {
  concepts: Concept[];
  loading: boolean;
}

const WordsContext = createContext<WordsContextType>({ concepts: [], loading: true });

export const useWords = () => useContext(WordsContext);

export const WordsProvider = ({ children }: { children: ReactNode }) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/data/words.json").then((mod) => {
      const data = mod.default;
      const raw = Array.isArray(data) ? (data as Concept[]) : [];
      // Deduplicate by english key (keep first occurrence)
      const seen = new Set<string>();
      const unique = raw.filter((c) => {
        if (seen.has(c.english)) return false;
        seen.add(c.english);
        return true;
      });
      setConcepts(unique);
      setLoading(false);
    });
  }, []);

  return (
    <WordsContext.Provider value={{ concepts, loading }}>
      {children}
    </WordsContext.Provider>
  );
};
