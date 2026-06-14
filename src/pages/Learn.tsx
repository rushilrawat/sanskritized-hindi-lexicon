import { useState, useMemo, useCallback, useEffect, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import { flattenWords } from "@/lib/flattenWords";
import LearnCard from "@/components/LearnCard";
import { Shuffle, Dices, RotateCcw, Bookmark, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useBookmarks, bookmarkId } from "@/hooks/useBookmarks";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/ManuscriptOrnaments";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import { useLearnProgress } from "@/hooks/useLearnProgress";

const Learn = forwardRef<HTMLDivElement>((_, ref) => {
  const { concepts, loading } = useWords();
  const { bookmarks, removeBookmark } = useBookmarks();
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem("learn-index");
    return saved ? parseInt(saved, 10) : 0;
  });
  const { learnCategory: selectedCategory, setLearnCategory: setSelectedCategory } = useAccessibility();
  const { t, n } = useTranslation();
  const navigate = useNavigate();
  const { setProgress } = useLearnProgress();

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

  const allWords = useMemo(() => flattenWords(concepts, "sanskrit_derived"), [concepts]);
  const bookmarkedWords = useMemo(
    () => allWords.filter((w) => bookmarks.includes(bookmarkId(w.english, w.dev))),
    [allWords, bookmarks]
  );

  const jumpToBookmark = useCallback(
    (english: string, dev: string) => {
      setShuffled(false);
      setSelectedCategory(null);
      setTimeout(() => {
        const idx = allWords.findIndex((w) => w.english === english && w.dev === dev);
        if (idx >= 0) {
          setIndex(idx);
          localStorage.setItem("learn-index", String(idx));
        }
      }, 0);
    },
    [setSelectedCategory, allWords]
  );

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

  // Push progress up to the navbar
  useEffect(() => {
    if (words.length > 0) {
      setProgress(((index + 1) / words.length) * 100);
    }
    return () => setProgress(null);
  }, [index, words.length, setProgress]);

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
      <PageHeader
        title={t("learn.title", "Learn Words")}
        glyph="✺"
        subtitle={
          <>
            {t("learn.subtitle", "Study Sanskrit-derived words one at a time. Use ← → keys to navigate, Space to listen.")}{" "}
            <span className="text-foreground/70 font-medium">
              ({n(words.length)} {t("learn.wordsAvailable", "words")})
            </span>
          </>
        }
      >
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
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {t("learn.bookmarks", "Bookmarks")}
                {bookmarkedWords.length > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium tabular-nums">
                    {n(bookmarkedWords.length)}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t("learn.bookmarks" as never, "Bookmarks")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {bookmarkedWords.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("learn.noBookmarks" as never, "No bookmarks yet. Tap the bookmark icon on a card to save it.")}
                  </p>
                ) : (
                  bookmarkedWords.map((w) => (
                    <div
                      key={bookmarkId(w.english, w.dev)}
                      className="group flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => jumpToBookmark(w.english, w.dev)}
                        className="flex-1 text-left"
                      >
                        <div className="font-devanagari text-lg text-foreground">{w.dev}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {w.roman} · {w.english}
                        </div>
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmarkId(w.english, w.dev))}
                        aria-label="Remove bookmark"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageHeader>



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
