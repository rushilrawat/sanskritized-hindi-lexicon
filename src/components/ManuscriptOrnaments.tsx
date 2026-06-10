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
 * A page header framed by faint saffron rules and a small Devanagari
 * subtitle. Used by Categories / Learn / Replace.
 */
export const PageHeader = ({
  title,
  devanagari,
  subtitle,
  glyph = "✦",
  children,
}: {
  title: ReactNode;
  devanagari?: string;
  subtitle?: ReactNode;
  glyph?: string;
  children?: ReactNode;
}) => (
  <header className="text-center mb-6 sm:mb-8 pt-2">
    <div
      className="font-devanagari text-primary text-base sm:text-lg tracking-[0.35em] mb-2 opacity-80"
      aria-hidden="true"
    >
      ॥ {glyph} ॥
    </div>
    <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
      {title}
    </h1>
    {devanagari && (
      <p className="font-devanagari text-sm sm:text-base text-saffron-dark mt-1">
        {devanagari}
      </p>
    )}
    {subtitle && (
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mt-2">
        {subtitle}
      </p>
    )}
    {children && <div className="mt-4">{children}</div>}
  </header>
);
