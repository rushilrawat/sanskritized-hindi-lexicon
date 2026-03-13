import { forwardRef } from "react";
import { Volume2 } from "lucide-react";
import type { FlatWord } from "@/lib/flattenWords";
import { useTranslation } from "@/hooks/useTranslation";
import descriptionsHi from "@/data/descriptions_hi";

interface LearnCardProps {
  word: FlatWord;
  onNext: () => void;
  onPrev: () => void;
  current: number;
  total: number;
  onViewFullEntry?: () => void;
}

const LearnCard = forwardRef<HTMLDivElement, LearnCardProps>(({ word, onNext, onPrev, current, total, onViewFullEntry }, ref) => {
  const { t } = useTranslation();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.dev);
    utterance.lang = "hi-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div ref={ref} className="card-elevated max-w-md mx-auto p-5 sm:p-8 text-center animate-fade-in">
      <div className="mb-4 sm:mb-6">
        <span className="font-devanagari text-3xl sm:text-4xl font-semibold text-foreground leading-relaxed">
          {word.dev}
        </span>
      </div>

      <button
        onClick={speak}
        aria-label="Listen to pronunciation"
        className="mx-auto mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
      >
        <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        {t("learn.listen", "Listen")}
      </button>

      <div className="space-y-1 mb-3 sm:mb-4">
        <p className="text-base sm:text-lg text-foreground font-medium">{word.roman}</p>
        <p className="text-ipa text-[11px] sm:text-sm">/{word.ipa}/</p>
        <p className="text-sm text-muted-foreground mt-2 capitalize">
          {word.english}
        </p>
        <div className="flex gap-1 justify-center mt-2">
          {word.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>

      {/* Synonyms (Paryayvachi) */}
      {word.synonyms.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            पर्यायवाची · {t("learn.synonyms", "Synonyms")}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {word.synonyms.map((syn) => (
              <span key={syn} className="font-devanagari text-sm text-foreground bg-saffron-light px-2 py-0.5 rounded">
                {syn}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Antonyms (Vilom) */}
      {word.antonyms.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            विलोम · {t("learn.antonyms", "Antonyms")}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {word.antonyms.map((ant) => (
              <span key={ant} className="font-devanagari text-sm text-foreground bg-secondary px-2 py-0.5 rounded">
                {ant}
              </span>
            ))}
          </div>
        </div>
      )}

      {onViewFullEntry && (
        <button
          onClick={onViewFullEntry}
          className="text-sm text-primary hover:underline transition-colors mb-3"
        >
          {t("learn.viewFullEntry", "View Full Entry →")}
        </button>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onPrev}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("learn.previous", "← Previous")}
        </button>
        <span className="text-xs text-muted-foreground">
          {current + 1} / {total}
        </span>
        <button
          onClick={onNext}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("learn.next", "Next →")}
        </button>
      </div>
    </div>
  );
});

LearnCard.displayName = "LearnCard";

export default LearnCard;
