import type { Concept } from "@/types/word";
import InlineAudio from "@/components/InlineAudio";

interface WordCardProps {
  concept: Concept;
}

const WordCard = ({ concept }: WordCardProps) => {
  return (
    <div className="card-elevated p-3 sm:p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-2 sm:mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground capitalize">{concept.english}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{concept.description}</p>
        </div>
        <span className="tag-badge shrink-0 ml-2 sm:ml-3 text-[10px] sm:text-xs">{concept.category}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
        {/* Sanskrit-derived */}
        <div>
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary mb-1.5 sm:mb-2">
            Sanskrit-Derived
          </h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {concept.sanskrit_derived.map((w, i) => (
              <li key={i} className="bg-saffron-light rounded-md px-2 py-1.5 sm:px-3 sm:py-2">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  <span className="font-devanagari text-sm sm:text-base font-medium text-foreground">{w.dev}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{w.roman}</span>
                  <span className="text-ipa text-[11px] sm:text-sm">/{w.ipa}/</span>
                  <InlineAudio text={w.dev} />
                </div>
                <div className="flex gap-1 mt-1 sm:mt-1.5 flex-wrap">
                  {w.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Historical Sources */}
        <div>
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2 mt-2 md:mt-0">
            Other Historical Sources
          </h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {concept.other_historical_sources.map((w, i) => (
              <li key={i} className="bg-secondary rounded-md px-2 py-1.5 sm:px-3 sm:py-2">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  <span className="font-devanagari text-sm sm:text-base font-medium text-foreground">{w.dev}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{w.roman}</span>
                  <span className="text-ipa text-[11px] sm:text-sm">/{w.ipa}/</span>
                  <InlineAudio text={w.dev} />
                </div>
                <div className="flex gap-1 mt-1 sm:mt-1.5 flex-wrap">
                  {w.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
