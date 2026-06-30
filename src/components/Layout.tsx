import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUp, BookOpen, Check, Languages, Moon, Settings, Share2, Sun } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useTranslation } from "@/hooks/useTranslation";
import { useLearnProgress } from "@/hooks/useLearnProgress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LayoutProps {
  children: React.ReactNode;
}

const ShareButton = ({ className, label }: { className?: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = window.location.origin;
    const text =
      "Sanskritized Hindi Lexicon · संस्कृतनिष्ठ हिन्दी शब्दकोश — An open, etymology-based reference of Sanskrit-derived Hindi vocabulary with Devanagari, IPA, and audio.";
    const shareMessage = `${text}\n\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Sanskritized Hindi Lexicon", text, url });
        return;
      } catch {
        setCopied(false);
      }
    }

    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label={label || "Share this website"}
      title={copied ? t("settings.copied", "Copied!") : t("settings.share", "Share")}
      className={className}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied && <span className="ml-1 text-xs">{t("settings.copied", "Copied!")}</span>}
    </button>
  );
};

const TextSizeControl = () => {
  const { textSize, setTextSize } = useAccessibility();
  const sizes = [
    { key: "default" as const, label: "A-" },
    { key: "large" as const, label: "A" },
    { key: "xl" as const, label: "A+" },
  ];

  return (
    <div className="archive-segmented" role="group" aria-label="Text size">
      {sizes.map((size) => (
        <button
          key={size.key}
          onClick={() => setTextSize(size.key)}
          aria-label={`Text size ${size.key}`}
          className={textSize === size.key ? "archive-segment-active" : ""}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
};

const HighContrastToggle = () => {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <button
      onClick={toggleHighContrast}
      aria-label="Toggle high contrast"
      title="High Contrast"
      className={`archive-icon-button ${highContrast ? "archive-icon-button-active" : ""}`}
    >
      HC
    </button>
  );
};

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useAccessibility();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={darkMode ? "Light mode" : "Dark mode"}
      className={`archive-icon-button ${darkMode ? "archive-icon-button-active" : ""}`}
    >
      {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
};

const HindiModeToggle = () => {
  const { hindiMode, toggleHindiMode } = useAccessibility();

  return (
    <button
      onClick={toggleHindiMode}
      aria-label="Toggle Hindi mode"
      title={hindiMode ? "English UI" : "हिन्दी UI"}
      className={`archive-icon-button ${hindiMode ? "archive-icon-button-active" : ""}`}
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="font-devanagari text-[11px]">अ</span>
    </button>
  );
};

const SettingsPanel = () => {
  const { t } = useTranslation();

  return (
    <PopoverContent align="end" className="archive-popover w-auto p-3 space-y-3">
      <div className="space-y-1.5">
        <p className="archive-control-label">{t("settings.textSize", "Text Size")}</p>
        <TextSizeControl />
      </div>
      <div className="space-y-1.5">
        <p className="archive-control-label">{t("settings.display", "Display")}</p>
        <div className="grid grid-cols-4 gap-1.5">
          <HindiModeToggle />
          <HighContrastToggle />
          <DarkModeToggle />
          <ShareButton className="archive-icon-button justify-center" />
        </div>
      </div>
    </PopoverContent>
  );
};

const SettingsTrigger = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button aria-label="Settings" className="archive-icon-button">
        <Settings className="h-3.5 w-3.5" />
      </button>
    </PopoverTrigger>
    <SettingsPanel />
  </Popover>
);

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-5 right-5 z-50 archive-scroll-button"
    >
      <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
};

const Brand = () => {
  const { t, hindiMode } = useTranslation();

  return (
    <NavLink to="/" className="archive-brand">
      <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0">
        <span className={`block truncate text-sm font-semibold ${hindiMode ? "font-devanagari" : "font-archive"}`}>
          {t("site.title", "Sanskritized Hindi Lexicon")}
        </span>
      </span>
    </NavLink>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const { t, hindiMode } = useTranslation();
  const { progress } = useLearnProgress();

  const navItems = [
    { to: "/", label: t("nav.home", "Home") },
    { to: "/categories", label: t("nav.categories", "Categories") },
    { to: "/learn", label: t("nav.learn", "Learn") },
    { to: "/replace", label: t("nav.replace", "Replace") },
    { to: "/about", label: t("nav.about", "About") },
  ];

  return (
    <div className="archive-shell min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <header className="archive-header sticky top-0 z-[1000]">
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border/70">
            <Brand />
            <SettingsTrigger />
          </div>
          <nav className="archive-mobile-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `archive-nav-link ${hindiMode ? "font-devanagari" : ""} ${isActive ? "archive-nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 px-4 lg:px-8 h-16">
          <Brand />
          <div className="flex items-center gap-2">
            <nav className="archive-desktop-nav" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `archive-nav-link ${hindiMode ? "font-devanagari" : ""} ${isActive ? "archive-nav-link-active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-border">
              <HindiModeToggle />
              <TextSizeControl />
              <HighContrastToggle />
              <DarkModeToggle />
              <ShareButton className="archive-icon-button" />
            </div>
            <div className="lg:hidden">
              <SettingsTrigger />
            </div>
          </div>
        </div>

        <div
          role={progress !== null ? "progressbar" : undefined}
          aria-valuemin={progress !== null ? 0 : undefined}
          aria-valuemax={progress !== null ? 100 : undefined}
          aria-valuenow={progress !== null ? Math.round(progress) : undefined}
          aria-label={progress !== null ? "Learn progress" : undefined}
          className="h-[3px] w-full bg-transparent overflow-hidden"
        >
          {progress !== null && (
            <div className="h-full archive-progress-bar transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1">{children}</main>

      <ScrollToTop />

      <footer className="relative z-10 archive-footer mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className={`text-xs text-muted-foreground ${hindiMode ? "font-devanagari" : ""}`}>
            {t("footer.tagline", "Sanskritized Hindi Lexicon · v2.0 · A neutral, open-source linguistic archive")}
          </p>
          <p className="text-[11px] text-muted-foreground/75">
            {t("footer.lastUpdated", "Last updated")}:{" "}
            {new Date(import.meta.env.VITE_BUILD_DATE || Date.now()).toLocaleDateString(hindiMode ? "hi-IN" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <a
            href="https://github.com/rushilrawat/sanskritized-hindi-lexicon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-primary hover:underline"
          >
            {t("footer.github", "GitHub")}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
