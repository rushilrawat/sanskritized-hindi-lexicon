import { useState, useMemo, forwardRef, useCallback, useEffect } from "react";
import { Copy, Check, ArrowRight, Eraser } from "lucide-react";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import { buildReplacementMap, replaceSentenceWithHighlights, normalizeFullStops } from "@/lib/replaceLogic";
import type { ReplacementDetail } from "@/lib/replaceLogic";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import EntryDetailDrawer from "@/components/EntryDetailDrawer";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/ManuscriptOrnaments";
import { toast } from "sonner";

const MAX_INPUT_LENGTH = 5000;
const DEBOUNCE_MS = 150;

const Replace = forwardRef<HTMLDivElement>((_, ref) => {
  const { concepts, loading } = useWords();
  const [input, setInput] = useState(() => {
    const stored = localStorage.getItem("replace-input") || "";
    return stored.slice(0, MAX_INPUT_LENGTH);
  });
  const [debouncedInput, setDebouncedInput] = useState(input);
  const [copied, setCopied] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const { t, n } = useTranslation();

  // Debounce expensive replacement computation
  useEffect(() => {
    const id = setTimeout(() => setDebouncedInput(input), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [input]);

  const map = useMemo(() => buildReplacementMap(concepts), [concepts]);

  const { text: output, segments, replacements } = useMemo(() => {
    if (!debouncedInput.trim()) return { text: "", segments: [], replacements: [] };
    const punctNormalized = normalizeFullStops(debouncedInput);
    return replaceSentenceWithHighlights(punctNormalized, map);
  }, [debouncedInput, map]);

  const hasChanges = debouncedInput.trim() !== "" && output !== debouncedInput;

  const handleReplacementClick = useCallback((detail: ReplacementDetail) => {
    const concept = concepts.find((c) => c.english === detail.conceptEnglish);
    if (concept) setSelectedConcept(concept);
  }, [concepts]);

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  return (
    <div ref={ref} className="container-page">
      <PageHeader
        title={t("replace.title", "Sentence Replacement")}
        glyph="❀"
        subtitle={t("replace.subtitle", "Paste a Hindi sentence below. Words from other historical sources will be replaced with their Sanskrit-derived equivalents.")}
      />


      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              {t("replace.inputLabel", "Input Text")}
            </label>
            {input.trim() && (
              <button
                onClick={() => { setInput(""); localStorage.removeItem("replace-input"); setSelectedConcept(null); }}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border hover:border-foreground/20"
              >
                <Eraser className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {t("replace.clear", "Clear")}
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              const v = e.target.value.slice(0, MAX_INPUT_LENGTH);
              setInput(v);
              try { localStorage.setItem("replace-input", v); } catch { /* quota */ }
              setSelectedConcept(null);
            }}
            maxLength={MAX_INPUT_LENGTH}
            rows={4}
            placeholder={t("replace.placeholder", "यहाँ अपना वाक्य लिखें...")}
            className="archive-search min-h-32 resize-y p-3 sm:p-4 text-sm sm:text-base font-devanagari"
          />
          <div className="mt-1 flex justify-end">
            <span className={`text-[10px] sm:text-xs tabular-nums ${input.length >= MAX_INPUT_LENGTH ? "text-destructive" : "text-muted-foreground/60"}`}>
              {n(input.length)} / {n(MAX_INPUT_LENGTH)}
            </span>
          </div>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="block text-xs sm:text-sm font-medium text-foreground">
                {t("replace.outputLabel", "Transformed Text")}
                {hasChanges && (
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-primary font-normal">
                    {t("replace.replacementsApplied", "· replacements applied")}
                  </span>
                )}
              </label>
              <button
                onClick={async () => {
                  try {
                    if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(output);
                    } else {
                      // Fallback for insecure contexts / older browsers
                      const ta = document.createElement("textarea");
                      ta.value = output;
                      ta.style.position = "fixed";
                      ta.style.opacity = "0";
                      document.body.appendChild(ta);
                      ta.select();
                      document.execCommand("copy");
                      document.body.removeChild(ta);
                    }
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    toast.error(t("replace.copyFailed", "Could not copy. Please copy manually."));
                  }
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border hover:border-foreground/20"
              >
                {copied ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                {copied ? t("replace.copied", "Copied!") : t("replace.copy", "Copy")}
              </button>
            </div>
            <div className="folio-card w-full p-3 sm:p-4 font-devanagari text-sm sm:text-base text-foreground min-h-[60px] sm:min-h-[80px] whitespace-pre-wrap">
              {segments.map((seg, i) =>
                seg.replaced ? (
                  <mark key={i} className="bg-primary/25 text-primary font-medium px-0.5 rounded-sm">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          </div>
        )}

        {hasChanges && replacements.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
              {t("replace.replacementsMade", "Replacements Made")} ({n(replacements.length)})
            </h2>
            <div className="flex flex-wrap gap-2">
              {replacements.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleReplacementClick(r)}
                  className="group archive-chip"
                >
                  <span className="font-devanagari text-muted-foreground line-through decoration-muted-foreground/40">
                    {r.original}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                  <span className="font-devanagari font-medium text-primary">
                    {r.replacement}{r.synonyms.length > 0 && `/${r.synonyms.join("/")}`}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 ml-0.5 group-hover:text-primary/60 transition-colors">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {input.trim() && !hasChanges && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("replace.noReplacements", "No replacements found in the input text.")}
          </p>
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
});

Replace.displayName = "Replace";

export default Replace;
