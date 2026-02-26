import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Learn from "./pages/Learn";
import Replace from "./pages/Replace";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { validateWords } from "@/lib/validateWords";
import wordsData from "@/data/words.json";
import type { Concept } from "@/types/word";

// Validate data on load (dev only)
if (import.meta.env.DEV) {
  const issues = validateWords(wordsData as Concept[]);
  if (issues.length > 0) {
    console.warn("⚠️ Word data validation issues:", issues);
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AccessibilityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/replace" element={<Replace />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AccessibilityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
