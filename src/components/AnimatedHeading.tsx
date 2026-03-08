import { useState, useEffect } from "react";

const headings = [
  { text: "Sanskritized Hindi Lexicon", className: "font-body text-foreground" },
  { text: "संस्कृतनिष्ठ हिंदी कोश", className: "font-devanagari text-primary" },
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
    <h1
      className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      } ${current.className}`}
    >
      {current.text}
    </h1>
  );
};

export default AnimatedHeading;
