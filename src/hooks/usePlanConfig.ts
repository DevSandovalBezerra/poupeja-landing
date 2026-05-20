import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlanConfig {
  prices: {
    monthly: {
      priceId: string;
      price: string;
      displayPrice: string;
    };
    annual: {
      priceId: string;
      price: string;
      originalPrice: string;
      savings: string;
      displayPrice: string;
      displayOriginalPrice: string;
      displaySavings: string;
    };
  };
  contact: {
    phone: string;
  };
}

const calculatePlanDerivedValues = (monthlyPrice: string, annualPrice: string) => {
  const monthlyValue = parseFloat((monthlyPrice || '').toString().replace(',', '.'));
  const annualValue = parseFloat((annualPrice || '').toString().replace(',', '.'));

  let monthlyEquivalent = '';
  let discountPercentage = '';

  if (!Number.isNaN(monthlyValue) && !Number.isNaN(annualValue) && monthlyValue > 0 && annualValue > 0) {
    const yearlyEquivalent = monthlyValue * 12;
    monthlyEquivalent = yearlyEquivalent.toFixed(2).replace('.', ',');
    const discount = ((yearlyEquivalent - annualValue) / yearlyEquivalent) * 100;
    discountPercentage = discount.toFixed(0);
  }

  return { monthlyEquivalent, discountPercentage };
};

const buildConfigFromValues = (
  monthlyPrice: string,
  annualPrice: string,
  monthlyPriceId: string,
  annualPriceId: string,
  contactPhone: string
): PlanConfig => {
  const { monthlyEquivalent, discountPercentage } = calculatePlanDerivedValues(monthlyPrice, annualPrice);

  return {
    prices: {
      monthly: {
        priceId: monthlyPriceId,
        price: monthlyPrice,
        displayPrice: monthlyPrice ? `R$ ${monthlyPrice}` : 'R$ -',
      },
      annual: {
        priceId: annualPriceId,
        price: annualPrice,
        originalPrice: monthlyEquivalent,
        savings: discountPercentage,
        displayPrice: annualPrice ? `R$ ${annualPrice}` : 'R$ -',
        displayOriginalPrice: monthlyEquivalent ? `R$ ${monthlyEquivalent}` : 'R$ -',
        displaySavings: discountPercentage ? `Economize ${discountPercentage}%` : 'Economize -%',
      }
    },
    contact: {
      phone: contactPhone || ''
    }
  };
};

const buildFallbackEnvConfig = (): PlanConfig => {
  return buildConfigFromValues(
    import.meta.env.VITE_PLAN_PRICE_MONTHLY || '',
    import.meta.env.VITE_PLAN_PRICE_ANNUAL || '',
    '',
    '',
    import.meta.env.VITE_SUPPORT_WHATSAPP || ''
  );
};

export const usePlanConfig = () => {
  const [config, setConfig] = useState<PlanConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);

        const { data: priceData, error: priceError } = await supabase.functions.invoke('get-stripe-prices');
        if (priceError || !priceData?.success) {
          throw new Error(priceError?.message || priceData?.error || 'Failed to fetch price IDs');
        }

        const { data: publicData, error: publicError } = await supabase.functions.invoke('get-public-settings');
        if (publicError) throw publicError;

        if (publicData?.success && publicData?.settings) {
          const pricingSettings = publicData.settings.pricing || {};
          const contactSettings = publicData.settings.contact || {};

          const settings: any = {};
          Object.keys(pricingSettings).forEach(key => {
            settings[key] = pricingSettings[key].value;
          });
          Object.keys(contactSettings).forEach(key => {
            settings[key] = contactSettings[key].value;
          });

          const monthlyPrice = settings.plan_price_monthly || '';
          const annualPrice = settings.plan_price_annual || '';
          const planConfig = buildConfigFromValues(
            monthlyPrice,
            annualPrice,
            priceData.prices.monthly || '',
            priceData.prices.annual || '',
            settings.contact_phone || ''
          );

          setConfig(planConfig);
        } else {
          throw new Error('Invalid response format');
        }

        setError(null);
      } catch (err) {
        console.error('Error loading plan config:', err);

        const fallbackConfig = buildFallbackEnvConfig();
        const hasFallbackData = !!(
          fallbackConfig.prices.monthly.price ||
          fallbackConfig.prices.annual.price ||
          fallbackConfig.contact.phone
        );

        setConfig(fallbackConfig);
        setError(hasFallbackData ? null : (err instanceof Error ? err.message : 'Failed to load configuration'));
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, isLoading, error };
};
