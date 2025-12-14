import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Signin from "./pages/SigninPage";
import Signup from "./pages/Signup";

import FAQsPage from "./components/faqs/page";
import SupportPage from "./components/support/page";
import SettingsPage from "./components/settings/page";
import WritingLevels from "./components/writingLevels/page";
import ReadingLevels from "./components/readingLevels/page";

// Writing Levels
import WritingEnglishLevel1 from "./components/writingEnglish/level1";
import WritingEnglishLevel2 from "./components/writingEnglish/level2";

import WritingHindiLevel1 from "./components/writingHindi/level1";
import WritingHindiLevel2 from "./components/writingHindi/level2";

import WritingMathLevel1 from "./components/writingMath/level1";
import WritingMathLevel2 from "./components/writingMath/level2";

// Reading Levels (English/Hindi/Math)
import ReadingEnglishLevel1 from "./components/readingEnglish/level1";
import ReadingEnglishLevel2 from "./components/readingEnglish/level2";
import ReadingEnglishLevel3 from "./components/readingEnglish/level3";
import ReadingEnglishLevel4 from "./components/readingEnglish/level4";
import ReadingEnglishLevel5 from "./components/readingEnglish/level5";

import ReadingHindiLevel1 from "./components/readingHindi/level1";
import ReadingHindiLevel2 from "./components/readingHindi/level2";
import ReadingHindiLevel3 from "./components/readingHindi/level3";

import ReadingMathLevel1 from "./components/readingMath/level1";
import ReadingMathLevel2 from "./components/readingMath/level2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/main" element={<Index />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Dynamic Subject Pages */}
            <Route path="/writing/:subject" element={<WritingLevels />} />
            <Route path="/reading/:subject" element={<ReadingLevels />} />

            {/* Writing Levels */}
            <Route path="/writingEnglish/level1" element={<WritingEnglishLevel1 />} />
            <Route path="/writingEnglish/level2" element={<WritingEnglishLevel2 />} />

            <Route path="/writingHindi/level1" element={<WritingHindiLevel1 />} />
            <Route path="/writingHindi/level2" element={<WritingHindiLevel2 />} />

            <Route path="/writingMath/level1" element={<WritingMathLevel1 />} />
            <Route path="/writingMath/level2" element={<WritingMathLevel2 />} />

            {/* Reading Levels */}
            <Route path="/reading/english/level1" element={<ReadingEnglishLevel1 />} />
            <Route path="/reading/english/level2" element={<ReadingEnglishLevel2 />} />
            <Route path="/reading/english/level3" element={<ReadingEnglishLevel3 />} />
            <Route path="/reading/english/level4" element={<ReadingEnglishLevel4 />} />
            <Route path="/reading/english/level5" element={<ReadingEnglishLevel5 />} />

            <Route path="/reading/hindi/level1" element={<ReadingHindiLevel1 />} />
            <Route path="/reading/hindi/level2" element={<ReadingHindiLevel2 />} />
            <Route path="/reading/hindi/level3" element={<ReadingHindiLevel3 />} />

            <Route path="/reading/maths/level1" element={<ReadingMathLevel1 />} />
            <Route path="/reading/maths/level2" element={<ReadingMathLevel2 />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
