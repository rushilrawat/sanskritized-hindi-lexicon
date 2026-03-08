import type { Concept } from "@/types/word";
import InlineAudio from "@/components/InlineAudio";
import wordsData from "@/data/words.json";

interface WordOfTheDayProps {
  concept: Concept;
  onViewEntry?: () => void;
}

const WordOfTheDay = ({ concept, onViewEntry }: WordOfTheDayProps) => {
  const mainWord = concept.sanskrit_derived[0];
  if (!mainWord) return null;

  // Gather synonyms (other sanskrit-derived words for same concept)
  const synonymDevs = concept.sanskrit_derived
    .map((w) => w.dev)
    .filter((d) => d !== mainWord.dev);

  // Resolve antonyms to Devanagari from linked english words
  const antonymDevs: string[] = [];
  if (concept.antonyms) {
    const allConcepts = wordsData as Concept[];
    for (const ant of concept.antonyms) {
      const antConcept = allConcepts.find((c) => c.english === ant);
      if (antConcept) {
        for (const w of antConcept.sanskrit_derived) {
          antonymDevs.push(w.dev);
        }
      }
    }
  }

  return (
    <div className="rounded-lg border-2 border-primary/30 shadow-md relative overflow-hidden pl-3 pr-4 py-4 sm:pl-5 sm:pr-6 sm:py-6 border-l-4 border-l-primary bg-gradient-to-br from-card via-card to-accent/30">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary mb-2 sm:mb-3">
        Word of the Day
      </p>
      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
        <span className="font-devanagari text-2xl sm:text-3xl font-semibold text-foreground">
          {mainWord.dev}
        </span>
        <InlineAudio text={mainWord.dev} />
      </div>
      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        <span className="text-base sm:text-lg text-muted-foreground">{mainWord.roman}</span>
        <span className="text-ipa text-[11px] sm:text-sm">/{mainWord.ipa}/</span>
      </div>
      <p className="text-sm sm:text-base text-foreground font-medium capitalize">{concept.english}</p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{concept.description}</p>

      {/* Synonyms */}
      {synonymDevs.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            पर्यायवाची · Synonyms:{" "}
          </span>
          {synonymDevs.map((s) => (
            <span key={s} className="font-devanagari text-sm text-foreground bg-saffron-light px-2 py-0.5 rounded mr-1.5">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Antonyms */}
      {antonymDevs.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            विलोम · Antonyms:{" "}
          </span>
          {antonymDevs.map((a) => (
            <span key={a} className="font-devanagari text-sm text-foreground bg-secondary px-2 py-0.5 rounded mr-1.5">
              {a}
            </span>
          ))}
        </div>
      )}

      {onViewEntry && (
        <button
          onClick={onViewEntry}
          className="mt-3 text-sm text-primary hover:underline transition-colors"
        >
          View Full Entry →
        </button>
      )}
    </div>
  );
};

export default WordOfTheDay;
