import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Share2, Check, Moon, Sun, Settings, ArrowUp, Languages } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useTranslation } from "@/hooks/useTranslation";
import { useLearnProgress } from "@/hooks/useLearnProgress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ShareButton = ({ className, label }: { className?: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = window.location.origin;
    const text = "Sanskritized Hindi Lexicon · संस्कृतनिष्ठ हिन्दी शब्दकोश — An open, etymology-based reference of Sanskrit-derived Hindi vocabulary with Devanagari, IPA, and audio.";
    const shareMessage = `${text}\n\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sanskritized Hindi Lexicon", text, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
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

interface LayoutProps {
  children: React.ReactNode;
}

const TextSizeControl = () => {
  const { textSize, setTextSize } = useAccessibility();
  const sizes = [
    { key: "default" as const, label: "A−" },
    { key: "large" as const, label: "A" },
    { key: "xl" as const, label: "A+" },
  ];

  return (
    <div className="flex items-center gap-0.5 border border-border rounded-md overflow-hidden">
      {sizes.map((s) => (
        <button
          key={s.key}
          onClick={() => setTextSize(s.key)}
          aria-label={`Text size ${s.key}`}
          className={`px-2 py-1 text-xs font-medium transition-colors ${
            textSize === s.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {s.label}
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
      className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
        highContrast
          ? "bg-foreground text-background border-foreground"
          : "text-muted-foreground border-border hover:text-foreground hover:bg-muted"
      }`}
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
      className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
        darkMode
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
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
      className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
        hindiMode
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <span className="flex items-center gap-1">
        <Languages className="h-3.5 w-3.5" />
        <span className="font-devanagari text-[11px]">अ</span>
      </span>
    </button>
  );
};

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
      className="fixed bottom-5 right-5 z-50 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all animate-fade-in"
    >
      <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
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
    <div className="min-h-screen flex flex-col bg-background relative">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Mobile: two-row header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
            <NavLink to="/" className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className={`font-semibold text-xs tracking-wide ${hindiMode ? "font-devanagari" : ""}`}>
                {t("site.title", "Sanskritized Hindi Lexicon")}
              </span>
            </NavLink>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Settings"
                  className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-3 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {t("settings.textSize", "Text Size")}
                  </p>
                  <TextSizeControl />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {t("settings.display", "Display")}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    <HindiModeToggle />
                    <HighContrastToggle />
                    <DarkModeToggle />
                    <ShareButton className="px-2 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <nav className="flex items-center justify-center gap-1 px-3 py-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${hindiMode ? "font-devanagari" : ""} ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        {/* Tablet & Desktop: single-row header */}
        <div className="hidden md:flex items-center justify-between px-4 lg:px-8 h-14">
          <NavLink to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className={`font-semibold text-sm tracking-wide ${hindiMode ? "font-devanagari" : ""}`}>
              {t("site.title", "Sanskritized Hindi Lexicon")}
            </span>
          </NavLink>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <nav className="flex items-center gap-1 lg:gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-md text-xs lg:text-sm whitespace-nowrap transition-colors ${hindiMode ? "font-devanagari" : ""} ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {/* Desktop inline controls */}
            <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
              <HindiModeToggle />
              <TextSizeControl />
              <HighContrastToggle />
              <DarkModeToggle />
              <ShareButton className="px-2 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center" />
            </div>
            {/* Tablet popover */}
            <div className="lg:hidden ml-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label="Settings"
                    className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-3 space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {t("settings.textSize", "Text Size")}
                    </p>
                    <TextSizeControl />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {t("settings.display", "Display")}
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      <HindiModeToggle />
                      <HighContrastToggle />
                      <DarkModeToggle />
                      <ShareButton className="px-2 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center" />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        {/* Learn-mode progress bar — flush with the navbar */}
        {progress !== null && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Learn progress"
            className="h-[3px] w-full bg-transparent overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--saffron-dark))] transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <ScrollToTop />

      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
          <p className={`text-xs text-muted-foreground ${hindiMode ? "font-devanagari" : ""}`}>
            {t("footer.tagline", "Sanskritized Hindi Lexicon · v1.0 · A neutral, open-source linguistic archive")}
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            {t("footer.lastUpdated" as never, "Last updated")}: {new Date(import.meta.env.VITE_BUILD_DATE || Date.now()).toLocaleDateString(hindiMode ? "hi-IN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
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
