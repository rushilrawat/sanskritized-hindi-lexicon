/**
 * Subtle, decorative Devanagari glyphs for manuscript background texture.
 * Purely ornamental — non-interactive, hidden from assistive tech.
 */
const GLYPHS = [
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ",
  "क", "ख", "ग", "घ", "च", "ज", "ट", "ड", "त", "द", "न",
  "प", "ब", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह",
  "ॐ", "ः", "ं", "ऽ",
];

// Deterministic pseudo-random scatter so glyphs don't reshuffle on every render.
const ITEMS = Array.from({ length: 18 }, (_, i) => {
  const seed = (n: number, m: number) => ((i + 1) * 9301 + n * 49297) % m;
  return {
    char: GLYPHS[seed(7, GLYPHS.length)],
    top: seed(3, 90) + 5,            // %
    left: seed(11, 90) + 5,          // %
    size: 1.4 + (seed(5, 20) / 10),  // rem
    rotate: seed(17, 20) - 10,       // deg
  };
});

const DevanagariBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {ITEMS.map((it, idx) => (
        <span
          key={idx}
          className="font-devanagari absolute text-foreground/[0.025] dark:text-foreground/[0.03] leading-none"
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            fontSize: `${it.size}rem`,
            transform: `translate(-50%, -50%) rotate(${it.rotate}deg)`,
          }}
        >
          {it.char}
        </span>
      ))}
    </div>
  );
};

export default DevanagariBackdrop;
