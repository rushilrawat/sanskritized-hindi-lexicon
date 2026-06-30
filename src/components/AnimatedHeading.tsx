import { useState, useEffect } from "react";

const headings = [
  { text: "Sanskritized Hindi Lexicon", className: "font-archive text-foreground" },
  { text: "संस्कृतनिष्ठ हिन्दी शब्दकोश", className: "font-devanagari-serif text-primary" },
  { text: "/səns.kɾɪ.t̪aɪzd ˈhɪndi ˈlɛksɪkən/", className: "font-mono text-muted-foreground" },
];

const AnimatedHeading = () => {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % headings.length);
        setFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = headings[index];

  return (
    <div className="space-y-1">
      <p className="archive-eyebrow" aria-hidden="true">॥ शब्दानुशासनम् ॥</p>
      <h1
        className={`archive-title transition-opacity duration-400 ${
          fading ? "opacity-0" : "opacity-100"
        } ${current.className}`}
      >
        {current.text}
      </h1>
    </div>
  );
};

export default AnimatedHeading;
