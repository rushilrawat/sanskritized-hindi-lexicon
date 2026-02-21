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
          <h2 className="text-lg font-semibold mb-2">Neutrality Statement</h2>
          <p className="text-muted-foreground">
            This project does not advocate for any linguistic purism. It does not assign value
            hierarchies to words based on their origins. Every word in every language carries
            historical weight and cultural significance. This lexicon exists purely as an
            educational and archival resource.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Linguistic Clarification</h2>
          <p className="text-muted-foreground">
            Hindi, as a living language, has absorbed vocabulary from many sources over centuries.
            Sanskrit-derived words include both <em>tatsama</em> (direct borrowings) and{" "}
            <em>tadbhava</em> (naturally evolved forms). Words from Persian, Arabic, and other
            languages entered through trade, governance, literature, and cultural exchange.
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
