import { forwardRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatNumber } from "@/lib/numerals";

const Ornament = ({ glyph = "❀" }: { glyph?: string }) => (
  <div className="manuscript-divider my-5 sm:my-6" aria-hidden="true">
    <span className="manuscript-divider-glyph">॥</span>
    <span className="manuscript-divider-glyph text-base">{glyph}</span>
    <span className="manuscript-divider-glyph">॥</span>
  </div>
);

const Section = ({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="manuscript-section">
    <span className="manuscript-number">
      <span>{n}</span>
    </span>
    <h2 className="text-base sm:text-lg font-semibold mb-2 text-foreground tracking-tight">
      {title}
    </h2>
    <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed space-y-2">
      {children}
    </div>
  </section>
);

const About = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="container-page max-w-3xl">
      <div className="manuscript-panel p-5 sm:p-8 md:p-10">
        <span className="manuscript-corner tl" aria-hidden="true" />
        <span className="manuscript-corner tr" aria-hidden="true" />
        <span className="manuscript-corner bl" aria-hidden="true" />
        <span className="manuscript-corner br" aria-hidden="true" />

        {/* Frontispiece */}
        <header className="text-center pt-3 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t("about.title", "About This Project")}
          </h1>
        </header>

        <Ornament glyph="✦" />

        <div className="grid gap-6 sm:gap-7">
          <Section n={1} title={t("about.purpose.title", "Purpose")}>
            <p className="manuscript-dropcap">
              {t(
                "about.purpose.text",
                "The Sanskritized Hindi Lexicon is a structured linguistic reference that presents Hindi vocabulary through its historical roots. It allows users to explore Sanskrit-derived words alongside words that entered Hindi through other languages such as Persian, Arabic, Turkic, and English."
              )}
            </p>
          </Section>

          <Section n={2} title={t("about.howToUse.title", "How to Use This Lexicon")}>
            <p>
              {t(
                "about.howToUse.intro",
                "Each entry is based on an English concept. For every concept, you will find:"
              )}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2 list-none">
              {[
                t("about.howToUse.item1", "Sanskrit-derived words"),
                t("about.howToUse.item2", "Words from other historical sources"),
                t("about.howToUse.item3", "Roman transliteration and pronunciation"),
                t("about.howToUse.item4", "Optional synonyms and antonyms"),
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="font-devanagari text-saffron-dark text-sm mt-0.5 select-none">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              {t(
                "about.howToUse.outro",
                "This makes it easy to compare how different words express similar ideas across linguistic traditions."
              )}
            </p>
          </Section>

          <Section n={3} title={t("about.neutrality.title", "Neutrality")}>
            <p>
              {t(
                "about.neutrality.text",
                "This project does not promote linguistic purism or assign value to words based on their origin. Every word carries its own historical and cultural significance. This lexicon exists purely as an educational and exploratory resource."
              )}
            </p>
          </Section>

          <Ornament glyph="❁" />

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <Section n={4} title={t("about.hindi.title", "About Hindi · हिन्दी")}>
              <p>
                {t(
                  "about.hindi.text",
                  "Hindi is a modern Indo-Aryan language, part of the Indo-European language family. It is spoken widely across northern and central India and is one of the official languages of the Indian Union."
                )}
              </p>
              <a
                href="https://en.wikipedia.org/wiki/Hindi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-xs sm:text-sm text-primary hover:underline"
              >
                {t("about.hindi.link", "Learn more on Wikipedia →")}
              </a>
            </Section>

            <Section n={5} title={t("about.sanskrit.title", "Sanskrit's Influence · संस्कृतम्")}>
              <p>
                {t(
                  "about.sanskrit.text",
                  "Sanskrit is one of the oldest documented Indo-European languages and has deeply influenced Hindi vocabulary through Tatsama and Tadbhava words."
                )}
              </p>
              <a
                href="https://en.wikipedia.org/wiki/Sanskrit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-xs sm:text-sm text-primary hover:underline"
              >
                {t("about.sanskrit.link", "Learn more on Wikipedia →")}
              </a>
            </Section>
          </div>

          <Section n={6} title={t("about.devanagari.title", "Devanagari Script · देवनागरी")}>
            <p>
              {t(
                "about.devanagari.text",
                "Devanagari is the script used for Hindi and several other South Asian languages. It is written from left to right and is known for its horizontal line (शिरोरेखा) connecting letters."
              )}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/Devanagari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs sm:text-sm text-primary hover:underline"
            >
              {t("about.devanagari.link", "Learn more on Wikipedia →")}
            </a>
          </Section>

          <Ornament glyph="✺" />

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <Section n={7} title={t("about.notes.title", "Notes")}>
              <p>
                {t(
                  "about.notes.text",
                  "This lexicon is not exhaustive. Word meanings and usage may vary depending on context, region, and speaker."
                )}
              </p>
            </Section>

            <Section n={8} title={t("about.code.title", "Code Availability")}>
              <p>
                {t(
                  "about.code.text",
                  "The source code for this project is publicly available for viewing and learning purposes."
                )}
              </p>
              <a
                href="https://github.com/rushilrawat/sanskritized-hindi-lexicon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-xs sm:text-sm text-primary hover:underline"
              >
                {t("about.code.link", "View on GitHub →")}
              </a>
            </Section>
          </div>

          <Section n={9} title={t("about.version.title", "Version")}>
            <p>
              {t(
                "about.version.text",
                "Version 1.0 · May 2025. This project will continue to grow with additional entries and refinements over time."
              )}
            </p>
          </Section>
        </div>

        <Ornament glyph="॥" />

        {/* Colophon */}
        <footer className="text-center space-y-3 pb-2">
          <p className="text-xs sm:text-sm text-muted-foreground italic max-w-xl mx-auto">
            {t(
              "about.disclaimer",
              "This is a linguistic archive. Not a correction tool. Not a political tool. Not a purity tool."
            )}
          </p>
          <button
            onClick={async () => {
              const url = window.location.origin;
              const text =
                "Sanskritized Hindi Lexicon · संस्कृतनिष्ठ हिन्दी शब्दकोश — An open, etymology-based reference of Sanskrit-derived Hindi vocabulary with Devanagari, IPA, and audio.";
              const shareMessage = `${text}\n\n${url}`;
              if (navigator.share) {
                try {
                  await navigator.share({ title: "Sanskritized Hindi Lexicon", text, url });
                  return;
                } catch {}
              }
              try {
                await navigator.clipboard.writeText(shareMessage);
                alert("Link copied to clipboard!");
              } catch {}
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            {t("about.share", "Liked our project? Share it →")}
          </button>
        </footer>
      </div>
    </div>
  );
});

About.displayName = "About";

export default About;
