import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Concept, WordEntry } from "@/types/word";
import InlineAudio from "@/components/InlineAudio";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import descriptionsHi from "@/data/descriptions_hi";
import { normalizeIpa } from "@/lib/normalize";
import { getPunctuationSymbol } from "@/lib/punctuationSymbols";
import { useTranslation } from "@/hooks/useTranslation";

interface EntryDetailDrawerProps {
  concept: Concept | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EntryWordList = ({
  title,
  words,
  muted = false,
}: {
  title: string;
  words: WordEntry[];
  muted?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <section>
      <h3 className={`entry-drawer-section-title ${muted ? "text-muted-foreground" : "text-primary"}`}>
        {title}
      </h3>
      <ul className="space-y-2">
        {words.map((word, index) => (
          <li key={`${word.dev}-${index}`} className={`entry-drawer-strip ${muted ? "entry-drawer-strip-muted" : ""}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-devanagari text-lg font-semibold text-foreground">{word.dev}</span>
              <span className="text-sm text-muted-foreground">{word.roman}</span>
              <span className="text-ipa">/{normalizeIpa(word.ipa)}/</span>
              <InlineAudio text={word.dev} />
            </div>
            {word.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {word.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{t(`tag.${tag}`, tag)}</span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

const EntryDetailDrawer = ({ concept, open, onOpenChange }: EntryDetailDrawerProps) => {
  const { t, hindiMode } = useTranslation();

  if (!concept) {
    return null;
  }

  const description = hindiMode && descriptionsHi[concept.english.toLowerCase()]
    ? descriptionsHi[concept.english.toLowerCase()]
    : concept.description;
  const symbol = getPunctuationSymbol(concept.english);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="entry-drawer-content overflow-y-auto">
        <SheetHeader className="entry-drawer-header">
          <p className="archive-eyebrow" aria-hidden="true">॥ प्रविष्टि ॥</p>
          <div className="flex min-w-0 items-start justify-between gap-3">
            <SheetTitle className="entry-drawer-title">
              {concept.english}
              {symbol && (
                <span className="ml-2 rounded bg-saffron-light px-2 py-0.5 font-mono text-lg text-primary">
                  {symbol}
                </span>
              )}
            </SheetTitle>
          </div>
          <SheetDescription className={`entry-drawer-description ${hindiMode ? "font-devanagari" : ""}`}>
            {description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={`/categories?category=${encodeURIComponent(concept.category)}`}
            className="tag-badge"
            onClick={() => onOpenChange(false)}
          >
            {t(`category.${concept.category}`, concept.category)}
          </Link>
          <Link
            to={`/?search=${encodeURIComponent(concept.english)}`}
            className="entry-drawer-link"
            onClick={() => onOpenChange(false)}
          >
            {t("entryDrawer.focusEntry", "Focus in archive")}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 space-y-6">
          <EntryWordList
            title={t("wordCard.sanskritDerived", "Sanskrit-Derived")}
            words={concept.sanskrit_derived}
          />
          <EntryWordList
            title={t("wordCard.otherSources", "Other Historical Sources")}
            words={concept.other_historical_sources}
            muted
          />
        </div>

        {concept.antonyms && concept.antonyms.length > 0 && (
          <section className="entry-drawer-related">
            <h3>{t("learn.antonyms", "Antonyms")}</h3>
            <div>
              {concept.antonyms.map((antonym) => (
                <span key={antonym} className="tag-pill">{antonym}</span>
              ))}
            </div>
          </section>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EntryDetailDrawer;
