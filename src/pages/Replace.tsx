import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import type { Concept } from "@/types/word";
import { useWords } from "@/hooks/useWords";
import { buildReplacementMap, replaceSentenceWithHighlights } from "@/lib/replaceLogic";
import DataFallback from "@/components/DataFallback";
import WordsLoading from "@/components/WordsLoading";

const Replace = () => {
  const { concepts, loading } = useWords();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const map = useMemo(() => buildReplacementMap(concepts), [concepts]);

  const { text: output, segments } = useMemo(() => {
    if (!input.trim()) return { text: "", segments: [] };
    return replaceSentenceWithHighlights(input, map);
  }, [input, map]);

  const hasChanges = input.trim() !== "" && output !== input;

  if (loading) return <WordsLoading />;

  if (concepts.length === 0) {
    return <DataFallback />;
  }

  return (
    <div className="container-page">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Sentence Replacement</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-8">
        Paste a Hindi sentence below. Words from other historical sources will be replaced with their Sanskrit-derived equivalents.
      </p>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
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

        {input.trim() && !hasChanges && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            No replacements found in the input text.
          </p>
        )}
      </div>
    </div>
  );
};

export default Replace;
