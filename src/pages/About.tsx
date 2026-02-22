const About = () => {
  return (
    <div className="container-page max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">About This Project</h1>

      <div className="space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2">Purpose</h2>
          <p className="text-muted-foreground">
            The Sanskritized Hindi Lexicon is a structured, open-source linguistic reference.
            It provides an etymology-based comparison of Sanskrit-derived Hindi vocabulary alongside
            vocabulary from other historical sources — including Persian, Arabic, Turkic, and English.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">About Hindi</h2>
          <p className="text-muted-foreground">
            Hindi is a modern Indo-Aryan language, part of the broader Indo-European language family.
            It is primarily spoken in northern and central India, and serves as one of the two official
            languages of the Indian Union. Written in the Devanagari script, Hindi has evolved over
            centuries through contact with numerous languages and cultures across the subcontinent.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Hindi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-primary hover:underline"
          >
            Learn more about Hindi on Wikipedia →
          </a>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Sanskrit's Historical Influence</h2>
          <p className="text-muted-foreground">
            Sanskrit, one of the oldest documented languages of the Indo-European family, has served
            as a foundational source of vocabulary for Hindi and many other South Asian languages.
            Its influence extends through two primary channels: <em>tatsama</em> words (direct
            borrowings that retain their original Sanskrit form) and <em>tadbhava</em> words
            (forms that have naturally evolved through centuries of spoken usage). This lexicon
            documents both categories alongside words that entered Hindi through other historical
            routes of cultural and linguistic exchange.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Neutrality Statement</h2>
          <p className="text-muted-foreground">
            This project does not advocate for any linguistic purism. It does not assign value
            hierarchies to words based on their origins. Every word in every language carries
            historical weight and cultural significance. This lexicon exists purely as an
            educational and archival resource.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Open Source</h2>
          <p className="text-muted-foreground">
            This project is open-source and welcomes contributions. The data is maintained in a
            single JSON file, making it easy to add, correct, or expand entries. Contributions
            should maintain the neutral, academic tone of the project.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-primary hover:underline"
          >
            View on GitHub →
          </a>
        </section>

        <section className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground italic">
            This is a linguistic archive. Not a correction tool. Not a political tool. Not a purity tool.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
