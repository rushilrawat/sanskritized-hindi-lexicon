import { Volume2 } from "lucide-react";

interface InlineAudioProps {
  text: string;
}

const InlineAudio = ({ text }: InlineAudioProps) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      aria-label={`Listen to ${text}`}
      className="inline-flex items-center justify-center p-1 rounded text-muted-foreground hover:text-primary transition-colors"
    >
      <Volume2 className="h-3.5 w-3.5" />
    </button>
  );
};

export default InlineAudio;
