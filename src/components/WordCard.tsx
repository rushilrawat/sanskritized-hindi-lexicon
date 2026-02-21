import type { Concept } from "@/types/word";

interface WordCardProps {
  concept: Concept;
}

const WordCard = ({ concept }: WordCardProps) => {
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground capitalize">{concept.english}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{concept.description}</p>
        </div>
        <span className="tag-badge shrink-0 ml-3">{concept.category}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Sanskrit-derived */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Sanskrit-Derived
          </h4>
          <ul className="space-y-2">
            {concept.sanskrit_derived.map((w, i) => (
              <li key={i} className="bg-saffron-light rounded-md px-3 py-2">
                <span className="font-devanagari text-base font-medium text-foreground">{w.dev}</span>
                <span className="ml-2 text-sm text-muted-foreground">{w.roman}</span>
                <span className="ml-2 text-ipa">/{w.ipa}/</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {w.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Historical Sources */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Other Historical Sources
          </h4>
          <ul className="space-y-2">
            {concept.other_historical_sources.map((w, i) => (
              <li key={i} className="bg-secondary rounded-md px-3 py-2">
                <span className="font-devanagari text-base font-medium text-foreground">{w.dev}</span>
                <span className="ml-2 text-sm text-muted-foreground">{w.roman}</span>
                <span className="ml-2 text-ipa">/{w.ipa}/</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {w.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {tag}
                    </span>
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
