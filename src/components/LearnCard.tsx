import { forwardRef, useEffect, useRef, useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import type { FlatWord } from "@/lib/flattenWords";
import { useTranslation } from "@/hooks/useTranslation";
import descriptionsHi from "@/data/descriptions_hi";
import { getPunctuationSymbol } from "@/lib/punctuationSymbols";

interface LearnCardProps {
  word: FlatWord;
  onNext: () => void;
  onPrev: () => void;
  current: number;
  total: number;
  onViewFullEntry?: () => void;
}

const LearnCard = forwardRef<HTMLDivElement, LearnCardProps>(({ word, onNext, onPrev, current, total, onViewFullEntry }, ref) => {
  const { t, hindiMode } = useTranslation();
  if (!word) return null;
  const hiDesc = descriptionsHi[word.english.toLowerCase()];

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.dev);
    utterance.lang = "hi-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div ref={ref} className="card-elevated max-w-md mx-auto p-5 sm:p-8 text-center animate-fade-in">
      <div className="mb-4 sm:mb-6 flex items-center justify-center gap-3">
        <span className="font-devanagari text-3xl sm:text-4xl font-semibold text-foreground leading-relaxed">
          {word.dev}
        </span>
        {getPunctuationSymbol(word.english) && (
          <span
            aria-label="Symbol"
            className="font-mono text-2xl sm:text-3xl text-primary bg-saffron-light px-2 py-1 rounded"
          >
            {getPunctuationSymbol(word.english)}
          </span>
        )}
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
        {!hindiMode && word.description && (
          <p className="text-xs sm:text-sm text-muted-foreground italic mt-1 px-2">
            {word.description}
          </p>
        )}
        {hindiMode && hiDesc && (
          <p className="text-sm text-muted-foreground mt-1 font-devanagari px-2">{hiDesc}</p>
        )}
        {word.tags.length > 0 && (
          <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-2 tracking-wide">
            {word.tags.slice(0, 2).map((tag) => t(`tag.${tag}` as never, tag)).join(" · ")}
          </p>
        )}
      </div>

      {/* Synonyms (Paryayvachi) */}
      {word.synonyms.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            <span className="font-devanagari">पर्यायवाची</span>
            {!hindiMode && <> · Synonyms</>}
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
            <span className="font-devanagari">विलोम</span>
            {!hindiMode && <> · Antonyms</>}
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

      <div className="grid grid-cols-3 items-center pt-4 border-t border-border">
        <button
          onClick={onPrev}
          className="justify-self-start px-2 sm:px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("learn.previous", "← Previous")}
        </button>
        <span className="justify-self-center text-xs text-muted-foreground tabular-nums">
          {current + 1} / {total}
        </span>
        <button
          onClick={onNext}
          className="justify-self-end px-2 sm:px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("learn.next", "Next →")}
        </button>
      </div>
    </div>
  );
});

LearnCard.displayName = "LearnCard";

export default LearnCard;
