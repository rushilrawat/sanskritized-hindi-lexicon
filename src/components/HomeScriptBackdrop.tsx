import { useEffect, useRef } from "react";

const GLYPHS = [
  "अ", "आ", "इ", "ई", "उ", "ऋ", "क", "ख", "ग", "च", "ज्ञ", "त्र",
  "ध", "न", "म", "य", "र", "व", "श", "स", "ह", "ॐ", "॥", "ं",
];

const ITEMS = Array.from({ length: 26 }, (_, i) => {
  const seed = (n: number, m: number) => ((i + 3) * 7919 + n * 104729) % m;
  return {
    char: GLYPHS[seed(5, GLYPHS.length)],
    top: seed(7, 78) + 8,
    left: seed(11, 86) + 7,
    size: 1.4 + seed(13, 24) / 10,
    rotate: seed(17, 30) - 15,
    delay: seed(19, 900),
  };
});

const HomeScriptBackdrop = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const progress = Math.min(window.scrollY / 280, 1);
      const el = ref.current;
      if (!el) return;
      el.style.opacity = String(Math.max(0, 1 - progress * 1.35));
      el.style.transform = `translateX(-50%) translateY(${-progress * 72}px) scale(${1 + progress * 0.035})`;
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
      {ITEMS.map((item, index) => (
        <span
          key={`${item.char}-${index}`}
          className="home-script-glyph"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            animationDelay: `${item.delay}ms`,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
};

export default HomeScriptBackdrop;
