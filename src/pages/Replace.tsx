import { useState, useMemo } from "react";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";
import { buildReplacementMap, replaceSentence } from "@/lib/replaceLogic";

const concepts = wordsData as Concept[];

const Replace = () => {
  const [input, setInput] = useState("");

  const map = useMemo(() => buildReplacementMap(concepts), []);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return replaceSentence(input, map);
  }, [input, map]);

  const hasChanges = input.trim() !== "" && output !== input;

  return (
    <div className="container-page">
      <h1 className="text-2xl font-bold text-foreground mb-2">Sentence Replacement</h1>
      <p className="text-muted-foreground mb-8">
        Paste a Hindi sentence below. Words from other historical sources will be replaced with their Sanskrit-derived equivalents.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="यहाँ अपना वाक्य लिखें..."
            className="w-full rounded-lg border border-border bg-card p-4 text-foreground font-devanagari placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y"
          />
        </div>

        {output && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Transformed Text
              {hasChanges && (
                <span className="ml-2 text-xs text-primary font-normal">· replacements applied</span>
              )}
            </label>
            <div className="w-full rounded-lg border border-border bg-saffron-light p-4 font-devanagari text-foreground min-h-[80px] whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}

        {input.trim() && !hasChanges && (
          <p className="text-sm text-muted-foreground">
            No replacements found in the input text.
          </p>
        )}
      </div>
    </div>
  );
};

export default Replace;
