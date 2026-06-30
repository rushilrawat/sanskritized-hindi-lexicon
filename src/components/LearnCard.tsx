import { forwardRef, useEffect, useRef, useState } from "react";
import { Volume2, Bookmark } from "lucide-react";
import { useBookmarks, bookmarkId } from "@/hooks/useBookmarks";
import SoundWave from "@/components/SoundWave";
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
  const { t, n, hindiMode } = useTranslation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [playing, setPlaying] = useState(false);
  const lastClickRef = useRef(0);

  // Stop any in-flight speech when the word changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, [word?.dev]);

  if (!word) return null;
  const hiDesc = descriptionsHi[word.english.toLowerCase()];

  const speak = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 600) return;
    lastClickRef.current = now;
    if (playing) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.dev);
    utterance.lang = "hi-IN";
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const bId = bookmarkId(word.english, word.dev);
  const bookmarked = isBookmarked(bId);

  return (
    <div ref={ref} className="folio-card max-w-md mx-auto p-5 sm:p-8 text-center animate-fade-in transition-all duration-300">
      <button
        onClick={() => toggleBookmark(bId)}
        aria-label={bookmarked ? t("learn.unbookmark", "Remove bookmark") : t("learn.bookmark", "Bookmark this word")}
        aria-pressed={bookmarked}
        className="absolute top-3 right-3 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
      >
        <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${bookmarked ? "fill-primary text-primary" : ""}`} />
      </button>
      <div className="mb-4 sm:mb-6 flex items-center justify-center gap-3">
        <span className="font-devanagari-serif text-3xl sm:text-4xl font-semibold text-foreground leading-relaxed">
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
        disabled={playing}
        aria-busy={playing}
        aria-label={playing ? "Playing pronunciation" : "Listen to pronunciation"}
        className="mx-auto mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
      >
        <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        {playing && <SoundWave className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
        {playing ? t("learn.playing", "Playing…") : t("learn.listen", "Listen")}
      </button>

      <div className="space-y-1 mb-3 sm:mb-4">
        <p className="text-base sm:text-lg text-foreground font-medium">{word.roman}</p>
        <p className="text-ipa text-[11px] sm:text-sm">/{word.ipa}/</p>
        <p className="text-sm text-foreground/80 mt-2 capitalize">
          {word.english}
        </p>
        {!hindiMode && word.description && (
          <p className="text-xs sm:text-sm text-foreground/75 italic mt-1 px-2">
            {word.description}
          </p>
        )}
        {hindiMode && hiDesc && (
          <p className="text-sm text-foreground/75 mt-1 font-devanagari px-2">{hiDesc}</p>
        )}
        {(word.category || word.tags.length > 0) && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 tracking-wide">
            {[
              word.category ? t(`category.${word.category}`, word.category) : null,
              ...word.tags.slice(0, 2).map((tag) => t(`tag.${tag}`, tag)),
            ].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {/* Synonyms (Paryayvachi) */}
      {word.synonyms.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1.5">
            <span className="font-devanagari">पर्यायवाची</span>
            {!hindiMode && <> · Synonyms</>}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {word.synonyms.map((syn) => (
              <span key={syn} className="tag-badge font-devanagari">
                {syn}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Antonyms (Vilom) */}
      {word.antonyms.length > 0 && (
        <div className="mb-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1.5">
            <span className="font-devanagari">विलोम</span>
            {!hindiMode && <> · Antonyms</>}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {word.antonyms.map((ant) => (
              <span key={ant} className="tag-pill font-devanagari">
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
          {n(current + 1)} / {n(total)}
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
