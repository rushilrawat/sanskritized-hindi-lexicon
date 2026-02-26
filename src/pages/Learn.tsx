import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import { flattenWords } from "@/lib/flattenWords";
import LearnCard from "@/components/LearnCard";
import { Shuffle, Dices } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import DataFallback from "@/components/DataFallback";

const concepts = Array.isArray(wordsData) ? (wordsData as Concept[]) : [];

const Learn = () => {
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);
  const { learnCategory: selectedCategory, setLearnCategory: setSelectedCategory } = useAccessibility();
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, []);

  const words = useMemo(() => {
    let filtered = selectedCategory
      ? concepts.filter((c) => c.category === selectedCategory)
      : concepts;
    const flat = flattenWords(filtered, "sanskrit_derived");
    if (shuffled) {
      const arr = [...flat];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return flat;
  }, [shuffled, selectedCategory]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  }, [words.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === " ") {
        e.preventDefault();
        const utterance = new SpeechSynthesisUtterance(words[index]?.dev);
        utterance.lang = "hi-IN";
        window.speechSynthesis.speak(utterance);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleShuffle = () => {
    setShuffled((s) => !s);
    setIndex(0);
  };

  const handleRandom = () => {
    setIndex(Math.floor(Math.random() * words.length));
  };

  // Reset index when category changes
  useEffect(() => {
    setIndex(0);
  }, [selectedCategory]);

  const handleViewFullEntry = useCallback(() => {
    if (words[index]) {
      navigate(`/?search=${encodeURIComponent(words[index].english)}`);
    }
  }, [words, index, navigate]);

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  if (words.length === 0) {
    return (
      <div className="container-page text-center text-muted-foreground py-12">
        No words in this category.
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Learn Words</h1>
        <p className="text-muted-foreground mb-4">
          Study Sanskrit-derived words one at a time. Use ← → keys to navigate, Space to listen.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            {shuffled ? "Sequential" : "Shuffle"}
          </button>
          <button
            onClick={handleRandom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Dices className="h-4 w-4" />
            Random
          </button>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <LearnCard
        word={words[index]}
        onNext={handleNext}
        onPrev={handlePrev}
        current={index}
        total={words.length}
        onViewFullEntry={handleViewFullEntry}
      />
    </div>
  );
};

export default Learn;
