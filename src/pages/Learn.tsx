import { useState, useMemo, useCallback, useEffect } from "react";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import { flattenWords } from "@/lib/flattenWords";
import LearnCard from "@/components/LearnCard";
import { Shuffle } from "lucide-react";

const concepts = wordsData as Concept[];

const Learn = () => {
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);

  const words = useMemo(() => {
    const flat = flattenWords(concepts);
    if (shuffled) {
      const arr = [...flat];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return flat;
  }, [shuffled]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  }, [words.length]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleShuffle = () => {
    setShuffled((s) => !s);
    setIndex(0);
  };

  if (words.length === 0) {
    return (
      <div className="container-page text-center text-muted-foreground py-12">
        No words available.
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Learn Words</h1>
        <p className="text-muted-foreground mb-4">
          Study one word at a time with pronunciation. Use ← → arrow keys to navigate.
        </p>
        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Shuffle className="h-4 w-4" />
          {shuffled ? "Sequential" : "Shuffle"}
        </button>
      </div>

      <LearnCard
        word={words[index]}
        onNext={handleNext}
        onPrev={handlePrev}
        current={index}
        total={words.length}
      />
    </div>
  );
};

export default Learn;
