import React, { useEffect } from 'react';
import { HeroSection } from './landing/components/HeroSection';
import { StatsSection } from './landing/components/StatsSection';
import { ProblemSolutionSection } from './landing/components/ProblemSolutionSection';
import { FeaturesSection } from './landing/components/FeaturesSection';
import { HowItWorksSection } from './landing/components/HowItWorksSection';
import { ShowcaseSection } from './landing/components/ShowcaseSection';
import { TestimonialSection } from './landing/components/TestimonialSection';
import { FaqSection } from './landing/components/FaqSection';
import { CtaFooterSection } from './landing/components/CtaFooterSection';

export function Landing() {
  // Simple smooth scroll logic for anchor links
  useEffect(() => {
    // Reset to top (Beranda) on mount/refresh
    window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/30">
      <HeroSection />
      <StatsSection />
      <ProblemSolutionSection />
      <ShowcaseSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <FaqSection />
      <CtaFooterSection />
    </div>
  );
}
