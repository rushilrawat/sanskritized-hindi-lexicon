import { NavLink } from "react-router-dom";
import { BookOpen } from "lucide-react";

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

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm tracking-wide">Sanskritized Hindi Lexicon</span>
          </NavLink>
          <nav className="flex items-center gap-1">
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
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-muted-foreground">
            Sanskritized Hindi Lexicon · A neutral, open-source linguistic archive
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
