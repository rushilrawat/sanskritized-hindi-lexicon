import { useState, useMemo, useCallback, useEffect, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import { flattenWords } from "@/lib/flattenWords";
import LearnCard from "@/components/LearnCard";
import { Shuffle, Dices, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useTranslation } from "@/hooks/useTranslation";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";

const Learn = forwardRef<HTMLDivElement>((_, ref) => {
  const { concepts, loading } = useWords();
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem("learn-index");
    return saved ? parseInt(saved, 10) : 0;
  });
  const { learnCategory: selectedCategory, setLearnCategory: setSelectedCategory } = useAccessibility();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, [concepts]);

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
  }, [shuffled, selectedCategory, concepts]);

  // Clamp index when words list changes
  useEffect(() => {
    if (words.length > 0 && index >= words.length) {
      setIndex(words.length - 1);
      localStorage.setItem("learn-index", String(words.length - 1));
    }
  }, [words.length, index]);

  const handleNext = useCallback(() => {
    setIndex((prev) => {
      const next = (prev + 1) % words.length;
      localStorage.setItem("learn-index", String(next));
      return next;
    });
  }, [words.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => {
      const next = (prev - 1 + words.length) % words.length;
      localStorage.setItem("learn-index", String(next));
      return next;
    });
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
    localStorage.setItem("learn-index", "0");
  };

  const handleRandom = () => {
    const next = Math.floor(Math.random() * words.length);
    setIndex(next);
    localStorage.setItem("learn-index", String(next));
  };

  const handleStartOver = () => {
    setIndex(0);
    localStorage.setItem("learn-index", "0");
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIndex(0);
    localStorage.setItem("learn-index", "0");
  }, [selectedCategory]);

  const handleViewFullEntry = useCallback(() => {
    if (words[index]) {
      navigate(`/?search=${encodeURIComponent(words[index].english)}`);
    }
  }, [words, index, navigate]);

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  if (words.length === 0) {
    return (
      <div className="container-page text-center text-muted-foreground py-8 sm:py-12">
        {t("learn.noWords", "No words in this category.")}
      </div>
    );
  }

  return (
    <div ref={ref} className="container-page">
      <div className="text-center mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">
          {t("learn.title", "Learn Words")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          {t("learn.subtitle", "Study Sanskrit-derived words one at a time. Use ← → keys to navigate, Space to listen.")}
        </p>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {shuffled ? t("learn.sequential", "Sequential") : t("learn.shuffle", "Shuffle")}
          </button>
          <button
            onClick={handleRandom}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Dices className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t("learn.random", "Random")}
          </button>
          {index > 0 && (
            <button
              onClick={handleStartOver}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t("learn.startOver", "Start Over")}
            </button>
          )}
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="">{t("learn.allCategories", "All Categories")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{t(`category.${cat}` as never, cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Manuscript-inspired progress bar */}
      <div
        className="max-w-md mx-auto mb-3 sm:mb-4"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={words.length}
        aria-valuenow={index + 1}
        aria-label={t("learn.progress" as never, "Progress")}
      >
        <div className="h-2 rounded-full border border-saffron-dark/30 bg-saffron-light overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--saffron-dark))] transition-[width] duration-500 ease-out"
            style={{ width: `${((index + 1) / words.length) * 100}%` }}
          />
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
});

Learn.displayName = "Learn";

export default Learn;
