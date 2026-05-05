import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import { WordsProvider } from "@/hooks/useWords";
import { LearnProgressProvider } from "@/hooks/useLearnProgress";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Learn from "./pages/Learn";
import Replace from "./pages/Replace";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <WordsProvider>
            <LearnProgressProvider>
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
            </LearnProgressProvider>
          </WordsProvider>
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
