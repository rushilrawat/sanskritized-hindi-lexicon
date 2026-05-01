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
        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.purpose.title", "Purpose")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.purpose.text", "The Sanskritized Hindi Lexicon is a structured, open-source linguistic reference. It provides an etymology-based comparison of Sanskrit-derived Hindi vocabulary alongside vocabulary from other historical sources — including Persian, Arabic, Turkic, and English.")}
          </p>
        </section>

        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.neutrality.title", "Neutrality Statement")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.neutrality.text", "This project does not advocate for any linguistic purism. It does not assign value hierarchies to words based on their origins. Every word in every language carries historical weight and cultural significance. This lexicon exists purely as an educational and archival resource.")}
          </p>
        </section>

        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.hindi.title", "About Hindi · हिन्दी")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.hindi.text", "Hindi is a modern Indo-Aryan language, part of the broader Indo-European language family. It is primarily spoken in northern and central India, and serves as one of the two official languages of the Indian Union. Written in the Devanagari script, Hindi has evolved over centuries through contact with numerous languages and cultures across the subcontinent.")}
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

        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.sanskrit.title", "Sanskrit's Historical Influence · संस्कृतम्")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.sanskrit.text", "Sanskrit, one of the oldest documented languages of the Indo-European family, has served as a foundational source of vocabulary for Hindi and many other South Asian languages. Its influence extends through two primary channels: tatsama words (direct borrowings that retain their original Sanskrit form) and tadbhava words (forms that have naturally evolved through centuries of spoken usage). This lexicon documents both categories alongside words that entered Hindi through other historical routes of cultural and linguistic exchange.")}
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

        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.devanagari.title", "Devanagari Script · देवनागरी")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.devanagari.text", "Devanagari is an abugida writing system used to write Hindi, Sanskrit, Marathi, Nepali, and several other South Asian languages. Derived from the ancient Brahmi script, it is written from left to right and is recognized for its distinctive horizontal headline (शिरोरेखा) connecting the letters. Each character represents a consonant-vowel combination, making it a highly phonetic script where pronunciation closely follows written form.")}
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

        <section>
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            {t("about.openSource.title", "Open Source")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("about.openSource.text", "This project is open-source and welcomes contributions. The data is maintained in a single JSON file, making it easy to add, correct, or expand entries. Contributions should maintain the neutral, academic tone of the project.")}
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm text-primary hover:underline"
          >
            {t("about.openSource.link", "View on GitHub →")}
          </a>
        </section>

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
