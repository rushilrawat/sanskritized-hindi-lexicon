import { forwardRef, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import SoundWave from "@/components/SoundWave";

interface InlineAudioProps {
  text: string;
}

const COOLDOWN_MS = 600;

const InlineAudio = forwardRef<HTMLButtonElement, InlineAudioProps>(({ text }, ref) => {
  const [playing, setPlaying] = useState(false);
  const lastClickRef = useRef(0);

  useEffect(() => () => {
    if (playing) window.speechSynthesis.cancel();
  }, [playing]);

  const speak = () => {
    const now = Date.now();
    if (now - lastClickRef.current < COOLDOWN_MS) return;
    lastClickRef.current = now;
    if (playing) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      ref={ref}
      onClick={speak}
      disabled={playing}
      aria-label={playing ? `Playing ${text}` : `Listen to ${text}`}
      aria-busy={playing}
      className="inline-flex items-center gap-1 p-1 rounded text-muted-foreground hover:text-primary disabled:opacity-100 disabled:text-primary transition-colors"
    >
      <Volume2 className="h-3.5 w-3.5" />
      {playing && <SoundWave className="h-3 w-3" />}
    </button>
  );
});

InlineAudio.displayName = "InlineAudio";

export default InlineAudio;
