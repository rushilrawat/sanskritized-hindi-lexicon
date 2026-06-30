import { useEffect, useRef } from "react";

const GLYPHS = [
  { char: "ॐ", top: 7, left: 6, size: 2.1, opacity: 0.14, tone: "saffron", delay: 0 },
  { char: "अ", top: 8, left: 13, size: 1.55, opacity: 0.12, tone: "primary", delay: 120 },
  { char: "आ", top: 9, left: 18, size: 1.65, opacity: 0.11, tone: "copper", delay: 240 },
  { char: "इ", top: 8, left: 24, size: 1.5, opacity: 0.1, tone: "leaf", delay: 360 },
  { char: "ई", top: 9, left: 30, size: 1.55, opacity: 0.1, tone: "indigo", delay: 480 },
  { char: "उ", top: 8, left: 36, size: 1.55, opacity: 0.1, tone: "primary", delay: 600 },
  { char: "ऋ", top: 9, left: 42, size: 1.65, opacity: 0.09, tone: "copper", delay: 720 },
  { char: "क", top: 8, left: 49, size: 1.5, opacity: 0.09, tone: "leaf", delay: 840 },
  { char: "ख", top: 9, left: 56, size: 1.52, opacity: 0.09, tone: "primary", delay: 960 },
  { char: "ग", top: 8, left: 63, size: 1.5, opacity: 0.09, tone: "saffron", delay: 1080 },
  { char: "घ", top: 10, left: 70, size: 1.45, opacity: 0.08, tone: "copper", delay: 1200 },
  { char: "च", top: 12, left: 78, size: 1.5, opacity: 0.08, tone: "indigo", delay: 1320 },
  { char: "श्री", top: 18, left: 84, size: 2.4, opacity: 0.1, tone: "saffron", delay: 140 },
  { char: "त", top: 25, left: 63, size: 1.7, opacity: 0.08, tone: "leaf", delay: 220 },
  { char: "न", top: 28, left: 73, size: 1.9, opacity: 0.085, tone: "primary", delay: 300 },
  { char: "म", top: 32, left: 18, size: 2.05, opacity: 0.09, tone: "copper", delay: 440 },
  { char: "र", top: 35, left: 39, size: 1.7, opacity: 0.08, tone: "indigo", delay: 520 },
  { char: "ज्ञ", top: 41, left: 52, size: 2.55, opacity: 0.085, tone: "saffron", delay: 580 },
  { char: "ल", top: 44, left: 79, size: 1.65, opacity: 0.07, tone: "leaf", delay: 650 },
  { char: "त्र", top: 50, left: 88, size: 2.25, opacity: 0.08, tone: "primary", delay: 720 },
  { char: "ध", top: 57, left: 13, size: 2.1, opacity: 0.075, tone: "copper", delay: 860 },
  { char: "भ", top: 61, left: 29, size: 1.65, opacity: 0.065, tone: "indigo", delay: 930 },
  { char: "य", top: 67, left: 40, size: 1.8, opacity: 0.065, tone: "leaf", delay: 1000 },
  { char: "व", top: 72, left: 78, size: 2, opacity: 0.065, tone: "saffron", delay: 1140 },
  { char: "ष", top: 76, left: 23, size: 1.6, opacity: 0.058, tone: "primary", delay: 1210 },
  { char: "स", top: 84, left: 59, size: 1.7, opacity: 0.058, tone: "copper", delay: 1280 },
  { char: "ह", top: 86, left: 90, size: 1.65, opacity: 0.055, tone: "leaf", delay: 1420 },
  { char: "ं", top: 92, left: 42, size: 1.4, opacity: 0.05, tone: "indigo", delay: 1540 },
];

const HomeScriptBackdrop = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const progress = Math.min(window.scrollY / 420, 1);
      const el = ref.current;
      if (!el) return;
      el.style.opacity = String(Math.max(0, 1 - progress * 1.45));
      el.style.transform = `translateX(-50%) translateY(${-progress * 82}px) scale(${1 + progress * 0.02})`;
    };

    const requestSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };

    const interval = window.setInterval(sync, 120);
    sync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync, { passive: true });
    document.addEventListener("scroll", requestSync, { passive: true, capture: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      document.removeEventListener("scroll", requestSync, { capture: true });
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="home-script-backdrop"
    >
      {GLYPHS.map((glyph, index) => (
        <span
          key={`${glyph.char}-${index}`}
          className="home-script-glyph"
          style={{
            top: `${glyph.top}%`,
            left: `${glyph.left}%`,
            fontSize: `${glyph.size}rem`,
            opacity: glyph.opacity,
            color: `hsl(var(--${glyph.tone}))`,
            animationDelay: `${glyph.delay}ms`,
          }}
        >
          {glyph.char}
        </span>
      ))}
    </div>
  );
};

export default HomeScriptBackdrop;
