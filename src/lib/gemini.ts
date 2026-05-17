import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger';
import { cache } from './cache';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface CreativePrompt {
  produto: string;
  publique: string;
  tom: 'profissional' | 'divertido' | 'formal' | 'casual' | 'inspirador';
  plataforma: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  tipo: 'post' | 'story' | 'caption' | 'hashtag' | 'bio';
}

export interface GeneratedCreative {
  id: string;
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
  imagePrompt?: string;
  createdAt: Date;
}

const RATE_LIMIT_KEY = 'gemini:ratelimit';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60000;

async function checkRateLimit(): Promise<boolean> {
  const now = Date.now();
  const cached = await cache.get<{ count: number; resetAt: number }>(RATE_LIMIT_KEY);

  if (!cached) {
    await cache.set(RATE_LIMIT_KEY, { count: 1, resetAt: now + RATE_LIMIT_WINDOW }, 60);
    return true;
  }

  if (now > cached.resetAt) {
    await cache.set(RATE_LIMIT_KEY, { count: 1, resetAt: now + RATE_LIMIT_WINDOW }, 60);
    return true;
  }

  if (cached.count >= RATE_LIMIT_MAX) {
    logger.warn('Rate limit exceeded', { limit: RATE_LIMIT_MAX, window: RATE_LIMIT_WINDOW });
    return false;
  }

  await cache.set(RATE_LIMIT_KEY, { count: cached.count + 1, resetAt: cached.resetAt }, 60);
  return true;
}

function buildPrompt(data: CreativePrompt): string {
  const toneGuidelines = {
    profissional: 'Use professional but accessible language. Clear value proposition.',
    divertido: 'Use fun, energetic language. Add humor where appropriate.',
    formal: 'Use formal, sophisticated language. Avoid slang.',
    casual: 'Use friendly, conversational language. Be direct.',
    inspirador: 'Use motivational, uplifting language. Focus on transformation.',
  };

  const platformGuidelines = {
    instagram: 'Short, punchy text. Max 150 chars for caption. Include 3-5 relevant hashtags.',
    facebook: 'Engaging story format. 1-2 paragraphs. Call to action in first sentence.',
    linkedin: 'Professional tone. 3-4 paragraphs. Focus on credibility and results.',
    twitter: 'Ultra short. Max 280 characters. Thread-friendly.',
    tiktok: 'Casual, trendy language. Use popular expressions. Hook in first 3 seconds.',
  };

  const tipoGuidelines = {
    post: 'Standard social media post format.',
    story: 'Ephemeral content. Urgent, interactive tone.',
    caption: 'Detailed description. Include all relevant information.',
    hashtag: 'Focus on trending and niche-specific hashtags.',
    bio: 'Short, impactful. Max 150 characters.',
  };

  return `
Você é um redator de marketing especialista em conteúdo em Português Brasileiro.

Produto/Serviço: ${data.produto}
Público-alvo: ${data.publique}

Tom: ${data.tom} - ${toneGuidelines[data.tom]}
Plataforma: ${data.plataforma} - ${platformGuidelines[data.plataforma]}
Tipo de conteúdo: ${data.tipo} - ${tipoGuidelines[data.tipo]}

Gere uma peça de marketing em Português Brasileiro com:
1. Título/chamada (max 10 palavras)
2. Corpo do texto (comprimento apropriado para a plataforma)
3. Call to action (1 frase curta)
4. 3-5 hashtags relevantes em Português Brasileiro
5. Opcional: Prompt para geração de imagem em inglês

Responda APENAS em formato JSON:
{
  "headline": "...",
  "body": "...",
  "cta": "...",
  "hashtags": ["...", "..."],
  "imagePrompt": "..." (opcional)
}
`;
}

export async function generateCreative(prompt: CreativePrompt): Promise<GeneratedCreative> {
  const canProceed = await checkRateLimit();
  if (!canProceed) {
    throw new Error('Rate limit exceeded. Please wait 1 minute.');
  }

  const cacheKey = `creative:${JSON.stringify(prompt)}`;
  const cached = await cache.get<GeneratedCreative>(cacheKey);
  if (cached) {
    logger.info('Returning cached creative', { prompt });
    return cached;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = buildPrompt(prompt);

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const creative: GeneratedCreative = {
      id: crypto.randomUUID(),
      headline: parsed.headline,
      body: parsed.body,
      cta: parsed.cta,
      hashtags: parsed.hashtags || [],
      imagePrompt: parsed.imagePrompt,
      createdAt: new Date(),
    };

    await cache.set(cacheKey, creative, 3600);
    logger.info('Creative generated successfully', { id: creative.id, platform: prompt.platform });

    return creative;
  } catch (error) {
    logger.error('Failed to generate creative', { error, prompt });
    throw error;
  }
}

export async function generateBatchCreatives(
  prompts: CreativePrompt[],
  onProgress?: (completed: number, total: number) => void
): Promise<GeneratedCreative[]> {
  const results: GeneratedCreative[] = [];

  for (let i = 0; i < prompts.length; i++) {
    try {
      const creative = await generateCreative(prompts[i]);
      results.push(creative);
    } catch (error) {
      logger.error('Failed to generate creative in batch', { index: i, error });
    }
    onProgress?.(i + 1, prompts.length);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}
