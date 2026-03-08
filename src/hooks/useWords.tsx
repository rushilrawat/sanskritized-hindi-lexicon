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
      setConcepts(Array.isArray(data) ? (data as Concept[]) : []);
      setLoading(false);
    });
  }, []);

  return (
    <WordsContext.Provider value={{ concepts, loading }}>
      {children}
    </WordsContext.Provider>
  );
};
