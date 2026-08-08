import LegalPage from "@/components/LegalPage";

const Terms = () => (
  <LegalPage title="Terms of Use" glyph="॥" subtitle="The terms governing access to this linguistic archive.">
    <section><h2 className="legal-section-title">Acceptance and purpose</h2><p>By using Sanskritized Hindi Lexicon, you agree to these terms. The site is an educational and reference archive. It is not a medical, legal, translation, language-purity, political, or professional-advice service.</p></section>
    <section><h2 className="legal-section-title">Accuracy and availability</h2><p>Vocabulary, transliteration, pronunciation, etymology, categories, and descriptions are curated materials and may contain omissions or errors. Verify important claims with primary linguistic sources. The service may change, become unavailable, or remove entries without notice.</p></section>
    <section><h2 className="legal-section-title">Acceptable use</h2><p>You may browse, search, learn from, and cite the archive for personal, educational, research, and contribution purposes permitted by the project license. Do not interfere with the service, attempt unauthorized access, scrape it in a way that harms availability, impersonate the project, or use the archive to facilitate unlawful activity.</p></section>
    <section><h2 className="legal-section-title">Intellectual property</h2><p>Project code, data, documentation, design, branding, and artwork are governed by the repository's source-available license. Third-party names, quotations, and linguistic material may belong to their respective rights holders. The project name and branding may not be used to imply endorsement or create a competing copy.</p></section>
    <section><h2 className="legal-section-title">No warranty and limitation</h2><p>To the extent permitted by applicable law, the archive is provided as-is without warranties of accuracy, fitness, availability, or non-infringement. The maintainer is not liable for decisions made solely from archive content. Nothing here limits rights that cannot legally be excluded in your jurisdiction.</p></section>
    <section><h2 className="legal-section-title">Updates and reporting</h2><p>These terms may be updated as the project grows. The current version is published here with its effective date. Questions or suspected violations may be reported through the project's <a className="legal-link" href="https://github.com/rushilrawat/sanskritized-hindi-lexicon/issues" target="_blank" rel="noopener noreferrer">GitHub issue tracker</a>.</p></section>
  </LegalPage>
);

export default Terms;
