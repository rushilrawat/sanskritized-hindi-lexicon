import { useCallback } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import translations, { type TranslationKey } from "@/lib/translations";

export const useTranslation = () => {
  const { hindiMode } = useAccessibility();

  const t = useCallback(
    (key: TranslationKey, englishFallback: string): string => {
      if (hindiMode) {
        return translations[key] || englishFallback;
      }
      return englishFallback;
    },
    [hindiMode]
  );

  return { t, hindiMode };
};
