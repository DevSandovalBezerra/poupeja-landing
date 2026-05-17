export interface LGPDConsent {
  id: string;
  userId: string;
  consentedAt: string;
  purposes: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    personalizacao: boolean;
  };
  ipAddress?: string;
  userAgent?: string;
}

export interface LGPDDataRequest {
  userId: string;
  type: 'access' | 'deletion' | 'portability' | 'correction';
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  data?: Record<string, unknown>;
}

const CONSENT_KEY = 'grana360_lgpd_consent';
const DATA_REQUESTS_KEY = 'grana360_lgpd_requests';

export const lgpd = {
  getConsent(): LGPDConsent | null {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setConsent(consent: LGPDConsent): void {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  },

  hasConsent(purpose: keyof LGPDConsent['purposes']): boolean {
    const consent = this.getConsent();
    if (!consent) return false;
    if (purpose === 'essential') return true;
    return consent.purposes[purpose] === true;
  },

  canProcessData(): boolean {
    return this.hasConsent('essential');
  },

  canUseAnalytics(): boolean {
    return this.hasConsent('analytics');
  },

  canUseMarketing(): boolean {
    return this.hasConsent('marketing');
  },

  requestData(type: LGPDDataRequest['type'], userId: string): LGPDDataRequest {
    const request: LGPDDataRequest = {
      userId,
      type,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    try {
      const stored = localStorage.getItem(DATA_REQUESTS_KEY);
      const requests: LGPDDataRequest[] = stored ? JSON.parse(stored) : [];
      requests.push(request);
      localStorage.setItem(DATA_REQUESTS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('[LGPD] Failed to store request', e);
    }
    return request;
  },

  getDataRequests(): LGPDDataRequest[] {
    try {
      const stored = localStorage.getItem(DATA_REQUESTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  maskCPF(cpf: string): string {
    if (!cpf || cpf.length !== 11) return cpf;
    return `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;
  },

  maskEmail(email: string): string {
    if (!email) return email;
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    const maskedLocal = local.length > 2 ? `${local[0]}***${local[-1]}` : '***';
    return `${maskedLocal}@${domain}`;
  },

  maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return phone;
    return `(***) ***-****`;
  },

  maskPIX(key: string, type: 'cpf' | 'email' | 'phone' | 'random'): string {
    switch (type) {
      case 'cpf': return this.maskCPF(key);
      case 'email': return this.maskEmail(key);
      case 'phone': return this.maskPhone(key);
      default: return `****-${key.slice(-4)}`;
    }
  },
};
