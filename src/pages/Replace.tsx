import { useState, useMemo, forwardRef, useCallback } from "react";
import { Copy, Check, ArrowRight, X, Eraser } from "lucide-react";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import { buildReplacementMap, replaceSentenceWithHighlights } from "@/lib/replaceLogic";
import type { ReplacementDetail } from "@/lib/replaceLogic";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";
import WordCard from "@/components/WordCard";

const Replace = forwardRef<HTMLDivElement>((_, ref) => {
  const { concepts, loading } = useWords();
  const [input, setInput] = useState(() => localStorage.getItem("replace-input") || "");
  const [copied, setCopied] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const map = useMemo(() => buildReplacementMap(concepts), [concepts]);

  const { text: output, segments, replacements } = useMemo(() => {
    if (!input.trim()) return { text: "", segments: [], replacements: [] };
    return replaceSentenceWithHighlights(input, map);
  }, [input, map]);

  const hasChanges = input.trim() !== "" && output !== input;

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
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Sentence Replacement</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-8">
        Paste a Hindi sentence below. Words from other historical sources will be replaced with their Sanskrit-derived equivalents.
      </p>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              Input Text
            </label>
            {input.trim() && (
              <button
                onClick={() => { setInput(""); localStorage.removeItem("replace-input"); setSelectedConcept(null); }}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border hover:border-foreground/20"
              >
                <Eraser className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => { const v = e.target.value; setInput(v); localStorage.setItem("replace-input", v); setSelectedConcept(null); }}
            rows={4}
            placeholder="यहाँ अपना वाक्य लिखें..."
            className="w-full rounded-lg border border-border bg-card p-3 sm:p-4 text-sm sm:text-base text-foreground font-devanagari placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y"
          />
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="block text-xs sm:text-sm font-medium text-foreground">
                Transformed Text
                {hasChanges && (
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-primary font-normal">· replacements applied</span>
                )}
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border hover:border-foreground/20"
              >
                {copied ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="w-full rounded-lg border border-primary/30 bg-saffron-light p-3 sm:p-4 font-devanagari text-sm sm:text-base text-foreground min-h-[60px] sm:min-h-[80px] whitespace-pre-wrap">
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
              Replacements Made ({replacements.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {replacements.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleReplacementClick(r)}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                >
                  <span className="font-devanagari text-muted-foreground line-through decoration-muted-foreground/40">
                    {r.original}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                  <span className="font-devanagari font-medium text-primary">
                    {r.replacement}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 ml-0.5 group-hover:text-primary/60 transition-colors">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedConcept && (
          <div className="relative">
            <button
              onClick={() => setSelectedConcept(null)}
              className="absolute -top-1 right-0 z-10 p-1 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <WordCard concept={selectedConcept} />
          </div>
        )}

        {input.trim() && !hasChanges && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            No replacements found in the input text.
          </p>
        )}
      </div>
    </div>
  );
});

Replace.displayName = "Replace";

export default Replace;