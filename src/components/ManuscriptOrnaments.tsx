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
  <header className="text-center mb-6 sm:mb-10 pt-4 sm:pt-6">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
        {subtitle}
      </p>
    )}
    <Ornament glyph={glyph} className="mt-5 max-w-xs mx-auto" />
    {children && <div className="mt-4">{children}</div>}
  </header>
);
