import { useEffect, useRef } from "react";

const GLYPHS = [
  { char: "ॐ", top: 10, left: 7, size: 5.8, opacity: 0.12, tone: "saffron", delay: 0 },
  { char: "अ", top: 12, left: 24, size: 4.2, opacity: 0.075, tone: "copper", delay: 140 },
  { char: "ग", top: 12, left: 77, size: 4.4, opacity: 0.072, tone: "leaf", delay: 280 },
  { char: "ज्ञ", top: 13, left: 94, size: 5.2, opacity: 0.082, tone: "primary", delay: 420 },
  { char: "श्री", top: 33, left: 91, size: 5.1, opacity: 0.082, tone: "saffron", delay: 560 },
  { char: "ध", top: 43, left: 16, size: 5.1, opacity: 0.073, tone: "indigo", delay: 700 },
  { char: "म", top: 63, left: 11, size: 4.8, opacity: 0.064, tone: "leaf", delay: 840 },
  { char: "त्र", top: 57, left: 92, size: 5.4, opacity: 0.066, tone: "copper", delay: 980 },
  { char: "व", top: 83, left: 86, size: 4.6, opacity: 0.056, tone: "primary", delay: 1120 },
  { char: "य", top: 78, left: 4, size: 4.3, opacity: 0.052, tone: "saffron", delay: 1260 },
  { char: "स", top: 91, left: 97, size: 4.7, opacity: 0.05, tone: "indigo", delay: 1400 },
];

const HomeScriptBackdrop = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const progress = Math.min(window.scrollY / 480, 1);
      const el = ref.current;
      if (!el) return;
      el.style.opacity = String(Math.max(0, 1 - progress * 1.5));
      el.style.transform = `translateX(-50%) translateY(${-progress * 140}px) scale(${1 + progress * 0.04})`;
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
