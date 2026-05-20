import React, { useEffect, useState } from 'react';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingBenefits from '@/components/landing/LandingBenefits';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingHeader from '@/components/landing/LandingHeader';
import { motion } from 'framer-motion';
import { useBrandingConfig } from '@/hooks/useBrandingConfig';
import { useBranding } from '@/contexts/BrandingContext';
import { supabase } from '@/integrations/supabase/client';
import { landingEnv } from '@/config/landingEnv';

const LandingPage = () => {
  const { companyName } = useBrandingConfig();
  const { isLoading: brandingLoading, lastUpdated } = useBranding();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [forcedTheme, setForcedTheme] = useState<string | null>(null);

  useEffect(() => {
    const loadAndApplyLandingTheme = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-public-settings', {
          body: { cacheBuster: Date.now() }
        });

        if (!error && data?.success && data?.settings?.branding?.landing_theme) {
          const theme = data.settings.branding.landing_theme.value;
          setForcedTheme(theme);

          if (theme && theme !== 'system') {
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
          }
        }
      } catch {
        // ignore and keep env/default theme behavior
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadAndApplyLandingTheme();

    return () => {
      if (forcedTheme && forcedTheme !== 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const savedTheme = localStorage.getItem('metacash-ui-theme');

        if (savedTheme === 'system' || !savedTheme) {
          root.classList.add(systemTheme);
        } else {
          root.classList.add(savedTheme);
        }
      }
    };
  }, [lastUpdated, forcedTheme]);

  if (!isThemeLoaded || brandingLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const templateClass = landingEnv.templateVariant === 'template2'
    ? 'bg-gradient-to-br from-background via-primary/5 to-secondary/5'
    : landingEnv.templateVariant === 'template3'
      ? 'bg-gradient-to-b from-background via-muted/30 to-background'
      : 'bg-gradient-to-br from-background via-muted/20 to-background';

  return (
    <div className={`min-h-screen w-full ${templateClass}`}>
      <LandingHeader />
      <motion.main
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LandingHero />
        <LandingFeatures />
        <LandingPricing />
        <LandingBenefits />
        <LandingCTA />
      </motion.main>

      <footer className="bg-card/50 border-t py-8 w-full">
        <div className="w-full px-4 text-center text-muted-foreground space-y-2">
          <p className="max-w-6xl mx-auto">&copy; 2025 {companyName} - Transforme sua vida financeira</p>
          <p className="text-sm">
            <a className="hover:underline" href={`mailto:${landingEnv.supportEmail}`}>{landingEnv.supportEmail}</a>
            {' · '}
            <a className="hover:underline" href={landingEnv.termsUrl} target="_blank" rel="noreferrer">Termos</a>
            {' · '}
            <a className="hover:underline" href={landingEnv.privacyUrl} target="_blank" rel="noreferrer">Privacidade</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
