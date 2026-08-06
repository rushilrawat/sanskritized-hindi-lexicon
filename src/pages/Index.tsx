import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import SearchBar from "@/components/SearchBar";
import WordOfTheDay from "@/components/WordOfTheDay";
import WordCard from "@/components/WordCard";
import EntryDetailDrawer from "@/components/EntryDetailDrawer";
import AnimatedHeading from "@/components/AnimatedHeading";
import HomeScriptBackdrop from "@/components/HomeScriptBackdrop";
import { getWordOfTheDay } from "@/lib/getWordOfTheDay";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import { useTranslation } from "@/hooks/useTranslation";
import { Ornament } from "@/components/ManuscriptOrnaments";
import {
  findClosestSearchSuggestion,
} from "@/lib/searchScoring";
import { searchConcepts } from "@/lib/searchConcepts";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BATCH_SIZE = 50;

const Index = () => {
  const { concepts, loading } = useWords();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<{ letter: string; english: string } | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [searchPinned, setSearchPinned] = useState(false);
  const [stickyTop, setStickyTop] = useState(72);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchAnchorRef = useRef<HTMLElement>(null);
  const searchClusterRef = useRef<HTMLDivElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearch(q);
    } else {
      setSearch("");
    }
  }, [searchParams, location.key]);

  const wotd = useMemo(() => getWordOfTheDay(concepts), [concepts]);

  const filtered = useMemo(() => {
    return searchConcepts(concepts, search);
  }, [search, concepts]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filtered]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "75%" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  useEffect(() => {
    if (search) {
      setActiveLetter(null);
      setActiveEntry(null);
      return;
    }

    const handleScroll = () => {
      const entries = document.querySelectorAll("[data-entry]");
      if (!entries.length) return;
      const searchCluster = searchPinned ? searchOverlayRef.current : searchClusterRef.current;
      const threshold = searchCluster
        ? searchCluster.getBoundingClientRect().bottom + 24
        : 240;
      let current: { letter: string; english: string } | null = null;
      for (const el of entries) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= threshold) {
          current = {
            letter: (el as HTMLElement).dataset.entryLetter || "",
            english: (el as HTMLElement).dataset.entry || "",
          };
        } else {
          break;
        }
      }
      setActiveLetter(current?.letter || null);
      setActiveEntry(current?.english ? current : null);
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(handleScroll);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [search, searchPinned, visibleCount, filtered.length]);

  useEffect(() => {
    const syncPinnedSearch = () => {
      const anchor = searchAnchorRef.current;
      const cluster = searchClusterRef.current;
      if (!anchor || !cluster) return;

      const nextStickyTop = 8;
      anchor.style.setProperty("--home-search-height", `${cluster.offsetHeight}px`);
      setStickyTop((prev) => Math.abs(prev - nextStickyTop) > 1 ? nextStickyTop : prev);

      const shouldPin = anchor.getBoundingClientRect().bottom <= nextStickyTop && window.scrollY > 80;
      setSearchPinned(shouldPin);
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncPinnedSearch);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [search, filtered.length]);

  const availableLetters = useMemo(() => {
    return new Set(filtered.map((c) => c.english[0].toUpperCase()));
  }, [filtered]);

  const suggestedCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const concept of concepts) {
      counts.set(concept.category, (counts.get(concept.category) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 4)
      .map(([category]) => category);
  }, [concepts]);

  const closestSuggestion = useMemo(
    () => filtered.length === 0 ? findClosestSearchSuggestion(concepts, search) : null,
    [concepts, filtered.length, search]
  );

  const handleJumpToLetter = useCallback((letter: string) => {
    const idx = filtered.findIndex(
      (c) => c.english[0].toUpperCase() === letter
    );
    if (idx === -1) return;

    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + BATCH_SIZE, filtered.length));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`word-${letter}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else {
      const el = document.getElementById(`word-${letter}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filtered, visibleCount]);

  const handleViewWotdEntry = useCallback(() => {
    if (wotd) {
      setSearch(wotd.english);
      setSearchParams({ search: wotd.english });
    }
  }, [wotd, setSearchParams]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setSearchParams({});
  }, [setSearchParams]);

  const lettersRendered = new Set<string>();
  const visibleItems = filtered.slice(0, visibleCount);

  const renderSearchRail = (pinned = false) => (
    <div
      ref={pinned ? searchOverlayRef : searchClusterRef}
      className={`home-search-cluster ${pinned ? "home-search-cluster-overlay" : ""}`}
    >
      <SearchBar onSearch={setSearch} autoFocus={!pinned} initialValue={search} />
      {!search && (
        <div className="mini-glossary-row">
          <div className="home-alphabet-nav" aria-label={t("index.browseByLetter", "Browse entries by letter")}>
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleJumpToLetter(letter)}
                  disabled={!isAvailable}
                  className={`home-letter-button ${
                    isActive
                      ? "home-letter-button-active"
                      : isAvailable
                        ? "text-foreground hover:bg-primary hover:text-primary-foreground"
                        : "text-muted-foreground/30 cursor-default"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          {activeEntry && (
            <div className="mini-glossary-pill" aria-live="polite">
              <span>{activeEntry.letter}</span>
              <b>{activeEntry.english}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback message={t("index.noData", "No word data found. The lexicon data file may be empty or malformed.")} />;
  }

  return (
    <div className="container-page home-page">
      {!search && <HomeScriptBackdrop />}
      <section className="archive-page-header">
        <AnimatedHeading />
        <p className="archive-subtitle">
          {t("index.subtitle", "A structured, etymology-based reference of Sanskrit-derived Hindi vocabulary.")}
        </p>
        <Ornament glyph="✦" className="mt-5 max-w-xs mx-auto" />
      </section>


      <section
        ref={searchAnchorRef}
        className="home-search-anchor"
        aria-label={t("search.placeholder", "Search by English, Devanagari, or IPA...")}
      >
        {renderSearchRail(false)}
      </section>

      {searchPinned && createPortal(
        <div className="home-search-overlay" style={{ top: `${stickyTop}px` }}>
          {renderSearchRail(true)}
        </div>,
        document.body
      )}

      {wotd && !search && (
        <section className="home-wotd-section">
          <WordOfTheDay concept={wotd} onViewEntry={handleViewWotdEntry} />
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-devanagari text-saffron-dark text-sm tracking-widest" aria-hidden="true">॥</span>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("index.allEntries", "All Entries")}
            </span>
            <span className="font-devanagari text-saffron-dark text-sm tracking-widest" aria-hidden="true">॥</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </section>
      )}


      <section className="space-y-3 sm:space-y-5" ref={listRef}>
        {filtered.length === 0 && (
          <div className="search-empty-state" role="status" aria-live="polite">
            <div className="search-empty-glyph" aria-hidden="true">अ</div>
            <p className="search-empty-eyebrow">
              {t("index.noEntriesEyebrow", "No manuscript match")}
            </p>
            <h2 className="search-empty-title">
              {t("index.noEntriesTitle", "Nothing found for")} <span>“{search.trim()}”</span>
            </h2>
            <p className="search-empty-copy">
              {t(
                "index.noEntriesHelp",
                "Try a Devanagari form, an IPA transcription, a simpler English root, or browse a related category."
              )}
            </p>

            {closestSuggestion && (
              <div className="search-empty-hints" aria-label={t("index.searchHints", "Search suggestions")}>
                <button type="button" onClick={() => setSearch(closestSuggestion.entry.dev)}>
                  {t("index.tryDevanagari", "Try Devanagari")} <span>{closestSuggestion.entry.dev}</span>
                </button>
                <button type="button" onClick={() => setSearch(closestSuggestion.entry.roman)}>
                  {t("index.tryRoman", "Try romanized Hindi")} <span>{closestSuggestion.entry.roman}</span>
                </button>
                <button type="button" onClick={() => setSearch(closestSuggestion.entry.ipa)}>
                  {t("index.tryIpa", "Try IPA")} <span>/{closestSuggestion.entry.ipa}/</span>
                </button>
              </div>
            )}

            {suggestedCategories.length > 0 && (
              <div className="search-empty-categories">
                <span>{t("index.browseRelated", "Browse categories")}</span>
                <div>
                  {suggestedCategories.map((category) => (
                    <Link key={category} to={`/categories?category=${encodeURIComponent(category)}`}>
                      {t(`category.${category}`, category)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button type="button" className="search-empty-reset" onClick={handleClearSearch}>
              {t("index.clearSearch", "Clear search")}
            </button>
          </div>
        )}
        {visibleItems.map((concept) => {
          const firstLetter = concept.english[0].toUpperCase();
          const needsAnchor = !lettersRendered.has(firstLetter);
          if (needsAnchor) lettersRendered.add(firstLetter);
          return (
            <div
              key={concept.english}
              id={needsAnchor ? `word-${firstLetter}` : undefined}
              data-letter={needsAnchor ? firstLetter : undefined}
              data-entry={concept.english}
              data-entry-letter={firstLetter}
              className={needsAnchor ? `letter-section-anchor ${activeLetter === firstLetter ? "letter-section-active" : ""}` : undefined}
            >
              <WordCard concept={concept} onOpenDetail={setSelectedConcept} />
            </div>
          );
        })}
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="flex justify-center py-6">
            <span className="text-sm text-muted-foreground animate-pulse">
              {t("index.loadingMore", "Loading more…")}
            </span>
          </div>
        )}
      </section>

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

export default Index;
