import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Share2, Check, Moon, Sun } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

const ShareButton = ({ className, label }: { className?: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.origin;
    const text = "Sanskritized Hindi Lexicon — A structured, etymology-based reference of Sanskrit-derived Hindi vocabulary.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sanskritized Hindi Lexicon", text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label={label || "Share this website"}
      title={copied ? "Copied!" : "Share"}
      className={className}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied && <span className="ml-1 text-xs">Copied!</span>}
    </button>
  );
};

const navItems = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/learn", label: "Learn" },
  { to: "/replace", label: "Replace" },
  { to: "/about", label: "About" },
];

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

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between h-12 sm:h-14">
          <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2 text-foreground hover:text-primary transition-colors">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-semibold text-xs sm:text-sm tracking-wide">Sanskritized Hindi Lexicon</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-0.5 md:gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-sm transition-colors ${
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
            <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
              <TextSizeControl />
              <HighContrastToggle />
              <DarkModeToggle />
              <ShareButton className="px-2 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center" />
            </div>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden border-t border-border">
          <div className="w-full px-2 flex items-center justify-between py-1.5">
            <nav className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-0.5 ml-1">
              <TextSizeControl />
              <HighContrastToggle />
              <DarkModeToggle />
              <ShareButton className="px-1.5 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center" label="Share" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            Sanskritized Hindi Lexicon · v1.0 · A neutral, open-source linguistic archive
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-primary hover:underline"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
