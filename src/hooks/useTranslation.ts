import { useCallback } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import translations, { type TranslationKey } from "@/lib/translations";
import { formatNumber } from "@/lib/numerals";

export const useTranslation = () => {
  const { hindiMode } = useAccessibility();

  const t = useCallback(
    (key: string, englishFallback: string): string => {
      if (hindiMode) {
        return translations[key as TranslationKey] || englishFallback;
      }
      return englishFallback;
    },
    [hindiMode]
  );

  const n = useCallback(
    (value: string | number): string => formatNumber(value, hindiMode),
    [hindiMode]
  );

  return { t, n, hindiMode };
};
