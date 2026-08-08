import { useState } from "react";
import LegalPage from "@/components/LegalPage";

const LOCAL_KEYS = ["replace-input", "learn-index", "learn-bookmarks", "pref-text-size", "pref-high-contrast", "pref-dark-mode", "pref-learn-category", "pref-hindi-mode"];

const Privacy = () => {
  const [cleared, setCleared] = useState(false);
  const clearLocalData = () => {
    LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
    setCleared(true);
    window.setTimeout(() => window.location.reload(), 700);
  };

  return (
    <LegalPage title="Privacy Policy" glyph="◌" subtitle="How Sanskritized Hindi Lexicon handles information across its global audience.">
      <section><h2 className="legal-section-title">Effective date</h2><p>This policy is effective August 7, 2026. It describes the current static version of Sanskritized Hindi Lexicon.</p></section>
      <section><h2 className="legal-section-title">What we collect</h2><p>This website has no accounts, sign-in system, database, advertising SDK, analytics tracker, contact form, payment flow, or server-side user profile. We do not intentionally collect names, email addresses, precise location, search history, or submitted text.</p></section>
      <section><h2 className="legal-section-title">Browser-local data</h2><p>The browser may store preferences, bookmarks, learning position, and text entered into the Replace tool in localStorage. This data remains in your browser and is not sent to this application’s server. Browser extensions, shared devices, browser sync, and hosting providers may have their own policies.</p><button type="button" onClick={clearLocalData} className="archive-button mt-3">{cleared ? "Local data cleared" : "Clear this app's local data"}</button></section>
      <section><h2 className="legal-section-title">Speech and external services</h2><p>Audio playback uses the browser's native speech synthesis capability. The browser and operating system may process text according to their own privacy practices. The application does not send dictionary text to a speech API.</p></section>
      <section><h2 className="legal-section-title">Hosting and security</h2><p>The site is deployed as a static application. The hosting provider may process standard technical request data such as IP address, timestamps, and user-agent information under its own privacy policy. Security headers, HTTPS, and a restrictive content security policy are configured for the deployment, but no online service can guarantee absolute security.</p></section>
      <section><h2 className="legal-section-title">Global privacy rights</h2><p>Depending on where you live, laws such as the GDPR, UK GDPR, CCPA/CPRA, LGPD, PIPEDA, POPIA, or India’s DPDP Act may provide rights concerning personal data. This app currently has no account data or server-side personal-data store to access, correct, port, or delete. Clearing local data above is the available deletion control. If you believe the hosting layer has retained personal data, contact the hosting provider or open a privacy issue in the project repository.</p></section>
      <section><h2 className="legal-section-title">Changes and contact</h2><p>Material changes will be reflected on this page with a new effective date. Privacy questions and requests can be raised through the project's <a className="legal-link" href="https://github.com/rushilrawat/sanskritized-hindi-lexicon/issues" target="_blank" rel="noopener noreferrer">GitHub issue tracker</a>. Do not include sensitive personal information in a public issue.</p></section>
    </LegalPage>
  );
};

export default Privacy;
