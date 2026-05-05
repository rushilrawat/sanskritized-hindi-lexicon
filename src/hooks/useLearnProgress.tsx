import { createContext, useContext, useState, ReactNode } from "react";

interface LearnProgressContextValue {
  progress: number | null; // 0-100, or null to hide
  setProgress: (value: number | null) => void;
}

const LearnProgressContext = createContext<LearnProgressContextValue | undefined>(undefined);

export const LearnProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<number | null>(null);
  return (
    <LearnProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </LearnProgressContext.Provider>
  );
};

export const useLearnProgress = () => {
  const ctx = useContext(LearnProgressContext);
  if (!ctx) throw new Error("useLearnProgress must be used within LearnProgressProvider");
  return ctx;
};
