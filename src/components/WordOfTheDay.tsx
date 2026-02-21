import type { Concept } from "@/types/word";
import InlineAudio from "@/components/InlineAudio";

interface WordOfTheDayProps {
  concept: Concept;
  onViewEntry?: () => void;
}

const WordOfTheDay = ({ concept, onViewEntry }: WordOfTheDayProps) => {
  const mainWord = concept.sanskrit_derived[0];
  if (!mainWord) return null;

  return (
    <div className="card-elevated p-6 border-l-4 border-l-primary">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        Word of the Day
      </p>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-devanagari text-3xl font-semibold text-foreground">
          {mainWord.dev}
        </span>
        <InlineAudio text={mainWord.dev} />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-lg text-muted-foreground">{mainWord.roman}</span>
        <span className="text-ipa">/{mainWord.ipa}/</span>
      </div>
      <p className="text-foreground font-medium capitalize">{concept.english}</p>
      <p className="text-sm text-muted-foreground mt-1">{concept.description}</p>
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
