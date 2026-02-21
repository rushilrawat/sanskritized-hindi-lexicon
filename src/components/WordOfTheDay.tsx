import type { Concept } from "@/types/word";

interface WordOfTheDayProps {
  concept: Concept;
}

const WordOfTheDay = ({ concept }: WordOfTheDayProps) => {
  const mainWord = concept.sanskrit_derived[0];
  if (!mainWord) return null;

  return (
    <div className="card-elevated p-6 border-l-4 border-l-primary">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        Word of the Day
      </p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-devanagari text-3xl font-semibold text-foreground">
          {mainWord.dev}
        </span>
        <span className="text-lg text-muted-foreground">{mainWord.roman}</span>
        <span className="text-ipa">/{mainWord.ipa}/</span>
      </div>
      <p className="text-foreground font-medium capitalize">{concept.english}</p>
      <p className="text-sm text-muted-foreground mt-1">{concept.description}</p>
    </div>
  );
};

export default WordOfTheDay;
