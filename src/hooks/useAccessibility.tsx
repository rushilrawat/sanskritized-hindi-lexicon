import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type TextSize = "default" | "large" | "xl";

interface AccessibilityState {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  learnCategory: string | null;
  setLearnCategory: (cat: string | null) => void;
  hindiMode: boolean;
  toggleHindiMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

const sizeMap: Record<TextSize, string> = {
  default: "100%",
  large: "112.5%",
  xl: "125%",
};

function loadPref<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): T {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const parsed = JSON.parse(v);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

const isTextSize = (v: unknown): v is TextSize =>
  v === "default" || v === "large" || v === "xl";
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
const isStringOrNull = (v: unknown): v is string | null =>
  v === null || typeof v === "string";

function savePref(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => loadPref("pref-text-size", "default"));
  const [highContrast, setHighContrast] = useState(() => loadPref("pref-high-contrast", false));
  const [darkMode, setDarkMode] = useState(() => loadPref("pref-dark-mode", false));
  const [learnCategory, setLearnCategoryState] = useState<string | null>(() => loadPref("pref-learn-category", null));
  const [hindiMode, setHindiMode] = useState(() => loadPref("pref-hindi-mode", false));

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    savePref("pref-text-size", size);
  };

  const setLearnCategory = (cat: string | null) => {
    setLearnCategoryState(cat);
    savePref("pref-learn-category", cat);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = sizeMap[textSize];
  }, [textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleHighContrast = () => {
    setHighContrast((v) => {
      savePref("pref-high-contrast", !v);
      return !v;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((v) => {
      savePref("pref-dark-mode", !v);
      return !v;
    });
  };

  const toggleHindiMode = () => {
    setHindiMode((v) => {
      savePref("pref-hindi-mode", !v);
      return !v;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        toggleHighContrast,
        darkMode,
        toggleDarkMode,
        learnCategory,
        setLearnCategory,
        hindiMode,
        toggleHindiMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};
