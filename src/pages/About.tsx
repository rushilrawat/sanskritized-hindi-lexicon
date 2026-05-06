import { forwardRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const About = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="container-page max-w-2xl">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        {t("about.title", "About This Project")}
      </h1>

      <div className="space-y-4 sm:space-y-6 text-foreground leading-relaxed">
        {/* 1. Purpose */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.purpose.title", "Purpose")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.purpose.text", "The Sanskritized Hindi Lexicon is a structured linguistic reference that presents Hindi vocabulary through its historical roots. It allows users to explore Sanskrit-derived words alongside words that entered Hindi through other languages such as Persian, Arabic, Turkic, and English.")}
          </p>
        </section>

        {/* 2. How to Use */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.howToUse.title", "How to Use This Lexicon")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.howToUse.intro", "Each entry is based on an English concept. For every concept, you will find:")}
          </p>
          <ul className="mt-2 space-y-1 text-sm sm:text-base text-muted-foreground list-disc list-inside marker:text-primary/60">
            <li>{t("about.howToUse.item1", "Sanskrit-derived words")}</li>
            <li>{t("about.howToUse.item2", "Words from other historical sources")}</li>
            <li>{t("about.howToUse.item3", "Roman transliteration and pronunciation")}</li>
            <li>{t("about.howToUse.item4", "Optional synonyms (पर्यायवाची) and antonyms (विलोम)")}</li>
          </ul>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {t("about.howToUse.outro", "This makes it easy to compare how different words express similar ideas across linguistic traditions.")}
          </p>
        </section>

        {/* 3. Neutrality */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.neutrality.title", "Neutrality")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.neutrality.text", "This project does not promote linguistic purism or assign value to words based on their origin. Every word carries its own historical and cultural significance. This lexicon exists purely as an educational and exploratory resource.")}
          </p>
        </section>

        {/* 4. About Hindi */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.hindi.title", "About Hindi · हिन्दी")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.hindi.text", "Hindi is a modern Indo-Aryan language, part of the Indo-European language family. It is spoken widely across northern and central India and is one of the official languages of the Indian Union. It is written in the Devanagari script and has evolved over centuries through interaction with multiple languages and cultures.")}
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Hindi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1.5 sm:mt-2 text-xs sm:text-sm text-primary hover:underline"
          >
            {t("about.hindi.link", "Learn more about Hindi on Wikipedia →")}
          </a>
        </section>

        {/* 5. Sanskrit */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.sanskrit.title", "Sanskrit's Influence · संस्कृतम्")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.sanskrit.text", "Sanskrit is one of the oldest documented Indo-European languages and has deeply influenced Hindi vocabulary. This influence appears mainly through Tatsama (direct borrowings from Sanskrit) and Tadbhava (words that evolved naturally over time). This lexicon documents both, along with words from other historical sources.")}
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Sanskrit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1.5 sm:mt-2 text-xs sm:text-sm text-primary hover:underline"
          >
            {t("about.sanskrit.link", "Learn more about Sanskrit on Wikipedia →")}
          </a>
        </section>

        {/* 6. Devanagari */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.devanagari.title", "Devanagari Script · देवनागरी")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.devanagari.text", "Devanagari is the script used for Hindi and several other South Asian languages. It is written from left to right and is known for its horizontal line (शिरोरेखा) connecting letters. The script is largely phonetic, meaning pronunciation closely follows how words are written.")}
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Devanagari"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1.5 sm:mt-2 text-xs sm:text-sm text-primary hover:underline"
          >
            {t("about.devanagari.link", "Learn more about Devanagari on Wikipedia →")}
          </a>
        </section>

        {/* 7. Notes */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.notes.title", "Notes")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.notes.text", "This lexicon is not exhaustive. Word meanings and usage may vary depending on context, region, and speaker.")}
          </p>
        </section>

        {/* 8. Code Availability */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.code.title", "Code Availability")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.code.text", "The source code for this project is publicly available for viewing and learning purposes.")}
          </p>
          <a
            href="https://github.com/rushilrawat/sanskritized-hindi-lexicon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm text-primary hover:underline"
          >
            {t("about.code.link", "View on GitHub →")}
          </a>
        </section>

        {/* 9. Version */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.version.title", "Version")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.version.text", "Version 1.0 · May 2025. This project will continue to grow with additional entries and refinements over time.")}
          </p>
        </section>

        {/* Footer: disclaimer + share */}
        <section className="border-t border-border pt-4 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground italic">
            {t("about.disclaimer", "This is a linguistic archive. Not a correction tool. Not a political tool. Not a purity tool.")}
          </p>
          <button
            onClick={async () => {
              const url = window.location.origin;
              const text = "Sanskritized Hindi Lexicon · संस्कृतनिष्ठ हिन्दी शब्दकोश — An open, etymology-based reference of Sanskrit-derived Hindi vocabulary with Devanagari, IPA, and audio.";
              const shareMessage = `${text}\n\n${url}`;
              if (navigator.share) {
                try { await navigator.share({ title: "Sanskritized Hindi Lexicon", text, url }); return; } catch {}
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
        </section>
      </div>
    </div>
  );
});

About.displayName = "About";

export default About;
