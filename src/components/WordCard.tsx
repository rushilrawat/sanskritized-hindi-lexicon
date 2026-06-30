import { memo } from "react";
import { PanelRightOpen } from "lucide-react";
import type { Concept, WordEntry } from "@/types/word";
import InlineAudio from "@/components/InlineAudio";
import { useTranslation } from "@/hooks/useTranslation";
import descriptionsHi from "@/data/descriptions_hi";
import { normalizeIpa } from "@/lib/normalize";
import { getPunctuationSymbol } from "@/lib/punctuationSymbols";

interface WordCardProps {
  concept: Concept;
  onOpenDetail?: (concept: Concept) => void;
}

function WordRow({ w, t }: { w: WordEntry; t: (k: string, fb: string) => string }) {
  const ipaNorm = normalizeIpa(w.ipa);
  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        <span className="font-devanagari text-sm sm:text-base font-medium text-foreground">{w.dev}</span>
        <span className="text-xs sm:text-sm text-muted-foreground">{w.roman}</span>
        <span className="text-ipa text-[11px] sm:text-sm">/{ipaNorm}/</span>
        <InlineAudio text={w.dev} />
      </div>
      <div className="flex gap-1 mt-1 sm:mt-1.5 flex-wrap">
        {w.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="tag-pill">{t(`tag.${tag}`, tag)}</span>
        ))}
      </div>
    </>
  );
}

const WordCard = memo(({ concept, onOpenDetail }: WordCardProps) => {
  const { t, hindiMode } = useTranslation();
  const description = hindiMode && descriptionsHi[concept.english.toLowerCase()]
    ? descriptionsHi[concept.english.toLowerCase()]
    : concept.description;
  const isInteractive = Boolean(onOpenDetail);

  const handleOpen = (target: EventTarget | null) => {
    if (!onOpenDetail) return;
    const element = target instanceof HTMLElement ? target : null;
    if (element?.closest("button, a, input, textarea, select, [role='button']")) return;
    onOpenDetail(concept);
  };

  return (
    <article
      className={`folio-card p-3 sm:p-5 animate-fade-in ${isInteractive ? "word-card-clickable" : ""}`}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? t("entryDrawer.open", "Open entry details") : undefined}
      onClick={(event) => handleOpen(event.target)}
      onKeyDown={(event) => {
        if (!onOpenDetail) return;
        if (event.key === "Enter") {
          event.preventDefault();
          onOpenDetail(concept);
        }
      }}
    >
      <div className="relative z-10 flex items-start justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-archive text-base sm:text-lg font-semibold text-foreground capitalize">{concept.english}</h3>
          {getPunctuationSymbol(concept.english) && (
            <span
              aria-label="Symbol"
              className="font-mono text-base sm:text-lg text-primary bg-saffron-light px-1.5 py-0.5 rounded leading-none"
            >
              {getPunctuationSymbol(concept.english)}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 ml-2 sm:ml-3">
          <span className="tag-badge text-[10px] sm:text-xs">{t(`category.${concept.category}`, concept.category)}</span>
          {onOpenDetail && (
            <button
              type="button"
              onClick={() => onOpenDetail(concept)}
              className="entry-detail-button"
              aria-label={t("entryDrawer.open", "Open entry details")}
              title={t("entryDrawer.open", "Open entry details")}
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className={`relative z-10 text-xs sm:text-sm text-muted-foreground -mt-1 mb-2 sm:mb-3 leading-relaxed ${hindiMode ? "font-devanagari" : ""}`}>{description}</p>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
        {/* Sanskrit-derived */}
        <div>
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary mb-1.5 sm:mb-2">
            {t("wordCard.sanskritDerived", "Sanskrit-Derived")}
          </h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {concept.sanskrit_derived.map((w, i) => (
              <li key={i} className="entry-strip">
                <WordRow w={w} t={t as (k: string, fb: string) => string} />
              </li>
            ))}
          </ul>
        </div>

        {/* Other Historical Sources */}
        <div>
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2 mt-2 md:mt-0">
            {t("wordCard.otherSources", "Other Historical Sources")}
          </h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {concept.other_historical_sources.map((w, i) => (
              <li key={i} className="entry-strip entry-strip-muted">
                <WordRow w={w} t={t as (k: string, fb: string) => string} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
});

WordCard.displayName = "WordCard";

export default WordCard;
