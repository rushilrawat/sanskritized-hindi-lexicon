import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import CategoryGrid from "@/components/CategoryGrid";
import WordCard from "@/components/WordCard";
import EntryDetailDrawer from "@/components/EntryDetailDrawer";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/ManuscriptOrnaments";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const BATCH_SIZE = 50;

const Categories = () => {
  const { concepts, loading } = useWords();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<{ letter: string; english: string } | null>(null);
  const [alphaPinned, setAlphaPinned] = useState(false);
  const [alphaTop, setAlphaTop] = useState(72);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const alphaAnchorRef = useRef<HTMLElement>(null);
  const alphaRailRef = useRef<HTMLDivElement>(null);
  const { t, n } = useTranslation();

  const categories = useMemo(() => {
    const cats = new Set(concepts.map((c) => c.category));
    return Array.from(cats).sort();
  }, [concepts]);

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...concepts].sort((a, b) => a.english.localeCompare(b.english));
    if (selectedCategory) {
      list = list.filter((c) => c.category === selectedCategory);
    }
    return list;
  }, [selectedCategory, concepts]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((c) => Math.min(c + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "75%" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const visibleItems = filtered.slice(0, visibleCount);

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  useEffect(() => {
    const handleScroll = () => {
      const entries = document.querySelectorAll("[data-category-entry]");
      if (!entries.length) {
        setActiveLetter(null);
        setActiveEntry(null);
        return;
      }

      const headerBottom = document.querySelector(".archive-header")?.getBoundingClientRect().bottom || 0;
      const threshold = Math.max(96, headerBottom + 96);
      let current: { letter: string; english: string } | null = null;
      for (const el of entries) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= threshold) {
          current = {
            letter: (el as HTMLElement).dataset.categoryEntryLetter || "",
            english: (el as HTMLElement).dataset.categoryEntry || "",
          };
        } else {
          break;
        }
      }
      setActiveLetter(current?.letter || null);
      setActiveEntry(current?.english ? current : null);
    };

    handleScroll();
    const id = window.setInterval(handleScroll, 180);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [visibleCount, filtered.length]);

  useEffect(() => {
    const syncPinnedRail = () => {
      const anchor = alphaAnchorRef.current;
      const rail = alphaRailRef.current;
      if (!anchor || !rail) return;

      const headerBottom = document.querySelector(".archive-header")?.getBoundingClientRect().bottom || 0;
      const nextTop = Math.max(8, Math.round(headerBottom + 8));
      anchor.style.setProperty("--category-alpha-height", `${rail.offsetHeight}px`);
      setAlphaTop((prev) => Math.abs(prev - nextTop) > 1 ? nextTop : prev);
      setAlphaPinned(anchor.getBoundingClientRect().bottom <= nextTop && window.scrollY > 80);
    };

    syncPinnedRail();
    const id = window.setInterval(syncPinnedRail, 180);
    window.addEventListener("scroll", syncPinnedRail, { passive: true });
    window.addEventListener("resize", syncPinnedRail, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", syncPinnedRail);
      window.removeEventListener("resize", syncPinnedRail);
    };
  }, [filtered.length, visibleCount]);

  const handleJumpToLetter = (letter: string) => {
    const targetIndex = filtered.findIndex(
      (c) => c.english[0].toUpperCase() === letter
    );
    if (targetIndex >= 0 && targetIndex >= visibleCount) {
      setVisibleCount(Math.min(targetIndex + BATCH_SIZE, filtered.length));
      requestAnimationFrame(() => {
        const el = document.getElementById(`cat-word-${letter}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      const el = document.getElementById(`cat-word-${letter}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const lettersRendered = new Set<string>();

  const renderAlphabetRail = (pinned = false) => (
    <div ref={pinned ? undefined : alphaRailRef} className="category-alpha-row">
      <div className="flex flex-wrap gap-1 justify-center">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleJumpToLetter(letter)}
            disabled={!availableLetters.has(letter)}
            className={`category-letter-button ${
              activeLetter === letter
                ? "home-letter-button-active"
                : availableLetters.has(letter)
                  ? "text-foreground hover:bg-primary hover:text-primary-foreground border border-border"
                  : "text-muted-foreground/30 cursor-default"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
      {activeEntry && (
        <div className="mini-glossary-pill" aria-live="polite">
          <span>{activeEntry.letter}</span>
          <b>{activeEntry.english}</b>
        </div>
      )}
    </div>
  );

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  return (
    <div className="container-page">
      <PageHeader
        title={t("categories.title", "Browse by Category")}
        glyph="❁"
        subtitle={
          <>
            {t("categories.subtitle", "Explore vocabulary grouped by thematic categories.")}{" "}
            <span className="text-foreground/70 font-medium">
              ({n(concepts.length)} {t("categories.entries", "entries")})
            </span>
          </>
        }
      />


      <div className="mb-4 sm:mb-6">
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleSelectCategory}
          showCounts
        />
      </div>

      {filtered.length > 5 && (
        <section ref={alphaAnchorRef} className="category-alpha-anchor">
          {renderAlphabetRail(false)}
        </section>
      )}

      {alphaPinned && createPortal(
        <div className="category-alpha-overlay" style={{ top: `${alphaTop}px` }}>
          {renderAlphabetRail(true)}
        </div>,
        document.body
      )}

      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {selectedCategory && (
          <h2 className="font-archive text-base sm:text-lg font-semibold text-foreground">{t(`category.${selectedCategory}`, selectedCategory)}</h2>
        )}
        {visibleItems.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div
              key={concept.english}
              id={needsAnchor ? `cat-word-${firstLetter}` : undefined}
              data-category-entry={concept.english}
              data-category-entry-letter={firstLetter}
            >
              <WordCard concept={concept} onOpenDetail={setSelectedConcept} />
            </div>
          );
        })}
        
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="py-4 text-center text-sm text-muted-foreground">
            {t("index.loadingMore", "Loading more…")}
          </div>
        )}
      </div>

      <EntryDetailDrawer
        concept={selectedConcept}
        open={Boolean(selectedConcept)}
        onOpenChange={(open) => {
          if (!open) setSelectedConcept(null);
        }}
      />
    </div>
  );
};

export default Categories;
