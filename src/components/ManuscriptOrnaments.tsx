import { ReactNode } from "react";

/**
 * Small, reusable manuscript-flavored ornaments used across pages
 * to give the site a quiet, pothi-inspired identity without becoming busy.
 */

export const Ornament = ({
  glyph = "✦",
  className = "",
}: {
  glyph?: string;
  className?: string;
}) => (
  <div className={`manuscript-divider ${className}`} aria-hidden="true">
    <span className="manuscript-divider-glyph">॥</span>
    <span className="manuscript-divider-glyph text-base">{glyph}</span>
    <span className="manuscript-divider-glyph">॥</span>
  </div>
);

/**
 * A consistent page header: large title, optional subtitle, and an
 * ornament rule beneath — mirroring the Home page layout so every
 * page sits on the same visual baseline.
 */
export const PageHeader = ({
  title,
  subtitle,
  glyph = "✦",
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  glyph?: string;
  children?: ReactNode;
}) => (
  <header className="archive-page-header">
    <p className="archive-eyebrow" aria-hidden="true">॥ अभिलेख ॥</p>
    <h1 className="archive-title">
      {title}
    </h1>
    {subtitle && (
      <p className="archive-subtitle">
        {subtitle}
      </p>
    )}
    <Ornament glyph={glyph} className="mt-5 max-w-xs mx-auto" />
    {children && <div className="mt-4">{children}</div>}
  </header>
);
