const parseFeatureList = (value: string | undefined, fallback: string[]): string[] => {
  if (!value || !value.trim()) return fallback;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const landingEnv = {
  templateVariant: import.meta.env.VITE_TEMPLATE_VARIANT || 'template1',
  logoWidth: Number(import.meta.env.VITE_LOGO_WIDTH || 200),
  logoHeight: Number(import.meta.env.VITE_LOGO_HEIGHT || 60),
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'suporte@poupeja.com',
  supportWhatsapp: import.meta.env.VITE_SUPPORT_WHATSAPP || '',
  termsUrl: import.meta.env.VITE_TERMS_URL || '/terms',
  privacyUrl: import.meta.env.VITE_PRIVACY_URL || '/privacy',
  planMonthlyPrice: import.meta.env.VITE_PLAN_PRICE_MONTHLY || '',
  planAnnualPrice: import.meta.env.VITE_PLAN_PRICE_ANNUAL || '',
  planFeaturesMonthly: parseFeatureList(import.meta.env.VITE_PLAN_FEATURES_MONTHLY, [
    'Movimentos ilimitados',
    'Dashboard completo',
    'Todos os relatórios',
    'Metas ilimitadas',
    'Agendamentos',
    'Suporte prioritário'
  ]),
  planFeaturesAnnual: parseFeatureList(import.meta.env.VITE_PLAN_FEATURES_ANNUAL, [
    'Movimentos ilimitados',
    'Dashboard completo',
    'Todos os relatórios',
    'Metas ilimitadas',
    'Agendamentos',
    'Suporte VIP',
    'Backup automático',
    'Análises avançadas'
  ])
};
