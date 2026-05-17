
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';
import MobileNavBar from '@/components/layout/MobileNavBar';
import MobileHeader from '@/components/layout/MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';
import { Sparkles, Copy, RefreshCw, Check, Zap, Clock, AlertCircle } from 'lucide-react';
import { generateCreative, generateBatchCreatives, CreativePrompt, GeneratedCreative } from '@/lib/gemini';
import { getCached, setCached } from '@/lib/cache';
import { toast } from 'sonner';

const AdminCriativos: React.FC = () => {
  const isMobile = useIsMobile();
  const { hideValues, toggleHideValues } = useAppContext();
  
  const [prompt, setPrompt] = useState<CreativePrompt>({
    produto: '',
    publique: '',
    tom: 'profissional',
    plataforma: 'instagram',
    tipo: 'post'
  });
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedCreative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [remainingRequests, setRemainingRequests] = useState(5);

  useEffect(() => {
    const cached = getCached('criativos_stats');
    if (cached) {
      setRemainingRequests(cached as number);
    }
  }, []);

  const updateRemainingRequests = (newCount: number) => {
    setRemainingRequests(newCount);
    setCached('criativos_stats', newCount, 60);
  };

  const handleGenerate = async () => {
    if (!prompt.produto || !prompt.publique) {
      toast.error('Preencha o produto e o público-alvo');
      return;
    }

    if (remainingRequests <= 0) {
      toast.error('Limite de requisições atingido. Aguarde 1 minuto.');
      return;
    }

    setIsLoading(true);
    try {
      const results = await generateBatchCreatives(prompt, 3);
      setGeneratedContent(results);
      updateRemainingRequests(remainingRequests - 1);
      toast.success('Conteúdo gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      toast.error('Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('Copiado para a área de transferência!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {isMobile ? (
        <div className="flex flex-col h-screen w-full">
          <MobileHeader hideValues={hideValues} toggleHideValues={toggleHideValues} />
          <main className="flex-1 overflow-auto p-4 pb-20 w-full">
            <div className="w-full">
              <CriativosContent 
                prompt={prompt}
                setPrompt={setPrompt}
                generatedContent={generatedContent}
                isLoading={isLoading}
                copiedIndex={copiedIndex}
                remainingRequests={remainingRequests}
                onGenerate={handleGenerate}
                onCopy={handleCopy}
              />
            </div>
          </main>
          <MobileNavBar />
        </div>
      ) : (
        <div className="flex w-full">
          <Sidebar />
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              <CriativosContent 
                prompt={prompt}
                setPrompt={setPrompt}
                generatedContent={generatedContent}
                isLoading={isLoading}
                copiedIndex={copiedIndex}
                remainingRequests={remainingRequests}
                onGenerate={handleGenerate}
                onCopy={handleCopy}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

interface CriativosContentProps {
  prompt: CreativePrompt;
  setPrompt: (prompt: CreativePrompt) => void;
  generatedContent: GeneratedCreative[];
  isLoading: boolean;
  copiedIndex: number | null;
  remainingRequests: number;
  onGenerate: () => void;
  onCopy: (content: string, index: number) => void;
}

const CriativosContent: React.FC<CriativosContentProps> = ({
  prompt,
  setPrompt,
  generatedContent,
  isLoading,
  copiedIndex,
  remainingRequests,
  onGenerate,
  onCopy
}) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-[#6B21A8]" />
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute inset-0 bg-[#6B21A8]/20 rounded-full blur-xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Criativos IA
          </h1>
        </div>
        <p className="text-gray-600">
          Gere conteúdo de marketing automaticamente com IA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Limite Diário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{remainingRequests}/5</div>
            <p className="text-xs text-white/70">requisições restantes</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#6B21A8]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6B21A8] flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Conteúdo Gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B21A8]">{generatedContent.length}</div>
            <p className="text-xs text-gray-500">itens criados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#6B21A8]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6B21A8] flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B21A8]">
              {isLoading ? '...' : 'Pronto'}
            </div>
            <p className="text-xs text-gray-500">
              {remainingRequests === 0 ? 'Aguarde 1min' : 'Disponível'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-[#6B21A8]">Configurações do Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Produto/Serviço *</label>
            <input
              type="text"
              value={prompt.produto}
              onChange={(e) => setPrompt({ ...prompt, produto: e.target.value })}
              placeholder="Ex: Curso de finanças pessoais"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6B21A8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Público-alvo *</label>
            <input
              type="text"
              value={prompt.publique}
              onChange={(e) => setPrompt({ ...prompt, publique: e.target.value })}
              placeholder="Ex: Jovens profissionais de 25-35 anos"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6B21A8] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tom</label>
              <select
                value={prompt.tom}
                onChange={(e) => setPrompt({ ...prompt, tom: e.target.value as CreativePrompt['tom'] })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6B21A8] focus:border-transparent"
              >
                <option value="profissional">Profissional</option>
                <option value="divertido">Divertido</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="inspirador">Inspirador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Plataforma</label>
              <select
                value={prompt.plataforma}
                onChange={(e) => setPrompt({ ...prompt, plataforma: e.target.value as CreativePrompt['plataforma'] })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6B21A8] focus:border-transparent"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={prompt.tipo}
                onChange={(e) => setPrompt({ ...prompt, tipo: e.target.value as CreativePrompt['tipo'] })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6B21A8] focus:border-transparent"
              >
                <option value="post">Post</option>
                <option value="story">Story</option>
                <option value="caption">Caption</option>
                <option value="hashtag">Hashtags</option>
                <option value="bio">Bio</option>
              </select>
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={isLoading || remainingRequests === 0}
            className="w-full bg-[#6B21A8] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#581C87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Gerar Conteúdo com IA
              </>
            )}
          </button>

          {remainingRequests === 0 && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              Limite atingido. Aguarde 1 minuto para gerar mais conteúdo.
            </div>
          )}
        </CardContent>
      </Card>

      {generatedContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#6B21A8]">Conteúdo Gerado</h2>
          {generatedContent.map((content, index) => (
            <Card key={index} className="border-2 border-[#6B21A8]/20">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-[#6B21A8]">
                  Opção {index + 1}
                </CardTitle>
                <button
                  onClick={() => handleCopy(content.conteudo, index)}
                  className="flex items-center gap-1 text-sm text-[#6B21A8] hover:text-[#581C87]"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700">{content.conteudo}</p>
                {content.hashtags && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-500 mb-2">Hashtags sugeridas:</p>
                    <p className="text-[#6B21A8]">{content.hashtags}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCriativos;
