import LegalPage from "@/components/LegalPage";

const Copyright = () => (
  <LegalPage title="Copyright & IP" glyph="✦" subtitle="A transparent process for attribution, corrections, and infringement concerns.">
    <section><h2 className="legal-section-title">Project rights</h2><p>Code, original descriptions, interface design, branding, and project artwork are protected by applicable copyright and related laws and are licensed under the repository's source-available contribution license. The license allows the permitted uses stated there; it does not grant permission to publish, rebrand, host, sell, or maintain an independent copy.</p></section>
    <section><h2 className="legal-section-title">Third-party material</h2><p>Individual words, scripts, historical terms, and general facts may not be exclusively owned by this project. The project aims to provide attribution and neutral source-aware descriptions. If an entry improperly reproduces protected material or omits required attribution, report it for review.</p></section>
    <section><h2 className="legal-section-title">How to report a concern</h2><ol className="list-decimal pl-5 space-y-2"><li>Open a private GitHub security advisory for confidential material, or use the public issue tracker for non-sensitive corrections.</li><li>Identify the URL, file, entry, or asset and explain your relationship to the rights involved.</li><li>Include relevant source, license, or authorization information where available.</li><li>Describe the requested remedy: attribution, correction, removal, replacement, or permission record.</li></ol><p className="mt-3">Do not post personal identity documents, private correspondence, or other sensitive evidence in a public issue.</p><a className="legal-link inline-block mt-3" href="https://github.com/rushilrawat/sanskritized-hindi-lexicon/issues" target="_blank" rel="noopener noreferrer">Report copyright or attribution concern</a></section>
    <section><h2 className="legal-section-title">Data corrections</h2><p>For linguistic corrections, use the repository's data-correction issue template. Explain the proposed spelling, pronunciation, meaning, historical source, and citation. Corrections are reviewed before inclusion and do not create ownership over the underlying language.</p></section>
  </LegalPage>
);

export default Copyright;
