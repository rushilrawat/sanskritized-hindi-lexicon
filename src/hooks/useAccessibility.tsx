import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type TextSize = "default" | "large" | "xl";

interface AccessibilityState {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

const sizeMap: Record<TextSize, string> = {
  default: "100%",
  large: "112.5%",
  xl: "125%",
};

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [textSize, setTextSize] = useState<TextSize>("default");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = sizeMap[textSize];
  }, [textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        toggleHighContrast: () => setHighContrast((v) => !v),
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
