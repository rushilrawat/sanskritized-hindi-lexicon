import { useEffect, useState } from "react";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setProgress(Math.min(window.scrollY / 280, 1));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="home-script-backdrop"
      style={{
        opacity: Math.max(0, 1 - progress * 1.35),
        transform: `translateY(${-progress * 72}px) scale(${1 + progress * 0.035})`,
      }}
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
