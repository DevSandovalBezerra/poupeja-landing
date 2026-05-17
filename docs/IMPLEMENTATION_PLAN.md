# Grana360 Admin - Plano de Implementação Granular

**Data:** 2026-04-24  
**Versão:** 1.0  
**Duração Total Estimada:** 12-14 semanas  
**Equipe:** Senior Frontend, Senior Backend, Senior Architect

---

## 🎯 Visão Geral

Plano de implementação granular com 10 fases para completar as funcionalidades faltantes do Grana360 Admin. Cada fase tem escopo definido, requisitos funcionais específicos, dependências, e critérios de aceitação verificáveis.

**Abordagem:**
- Fases em paralelo onde possível (Fases 1-5 independentes)
- Fase 2 (Push) e Fase 3 (Tutorials) rápidas (pode pré-requisito)
- Fase 6 (IA Agent) depende de Fase 1
- Fase 10 (Deploy) por último (integra tudo)

---

# FASE 1: Módulo de Criativos/IA (Criativos Infinitos)

**Duração:** 3 semanas  
**Esforço:** 40 story points  
**Status:** Não iniciado

## Objetivo
Implementar gerenciador completo de criativos com integração Gemini API para gerar conteúdo de marketing (imagens, textos, headlines).

## Dependências
- Nenhuma (standalone)
- Requer: Supabase, API key Gemini (configurável)

## Requisitos Funcionais (RF 1.1-1.5)

### 1.1.1 - Setup: Criar estrutura de BD e tabelas
**O que fazer:**
- Criar migration Supabase: tabelas `criativos`, `criativo_versoes`, `templates_briefing`
- Adicionar campos: id, titulo, tipo, briefing_id, resultado_json, status, versao, user_id, timestamps
- Criar índices em: tipo, status, user_id, criado_em
- Adicionar RLS policies: usuário vê apenas seus criativos

**Verificar:**
```bash
# Query no Supabase
SELECT * FROM criativos LIMIT 1;  # Retorna estrutura correta
SELECT * FROM pg_indexes WHERE tablename = 'criativos'; # Índices criados
```

**Tempo:** 30min | **Responsável:** Backend

---

### 1.1.2 - Setup: Configurar Gemini API
**O que fazer:**
- Criar tabela `integracoes` se não existir, adicionar linhas para Gemini config
- Criar arquivo `src/integrations/gemini.ts` com: client init, error handling, rate limiting
- Implementar função `generateCreativo(briefing, tipo)` que chama Gemini
- Implementar retry com exponential backoff (max 3 tentativas)
- Adicionar timeout de 30s por request

**Verificar:**
```typescript
// No código
import { generateCreativo } from '@/integrations/gemini';
const result = await generateCreativo({tipo: 'text', briefing: 'test'});
// result contém: resultado_json, tokens_usados, timestamp
```

**Tempo:** 1h | **Responsável:** Backend

---

### 1.1.3 - Admin Panel: Seção de Criativos no Sidebar
**O que fazer:**
- Adicionar novo item no Sidebar.tsx: "Criativos" (ícone Sparkles)
- Criar rota `/admin/criativos`
- Criar componente `AdminCriativos.tsx` (container)
- Layout: header + tab (Dashboard/Novo)

**Verificar:**
- Sidebar mostra "Criativos" e clicável
- Rota `/admin/criativos` abre tela

**Tempo:** 30min | **Responsável:** Frontend

---

### 1.1.4 - Dashboard de Criativos
**O que fazer:**
- Criar componente `CriativosList.tsx`:
  - Listar criativos do usuário (com pagination, 10 itens/página)
  - Tabela com: Imagem preview, Nome, Tipo, Status, Data criação
  - Ações: Ver / Editar / Deletar / Baixar / Compartilhar
- Criar componente `CriativosFilters.tsx`:
  - Filtros: tipo (dropdown), status (checkbox), data range
  - Busca por nome (debounced 500ms)
- Criar componente `CriativosStats.tsx`:
  - Cards: Total, Por tipo (imagem/texto/headline), Últimos 7 dias

**Verificar:**
- Carrega lista de criativos
- Filtros funcionam (mínimo 1 criativo para testar)
- Stats atualizam em real-time

**Tempo:** 2h | **Responsável:** Frontend

---

### 1.1.5 - Form para Gerar Criativo
**O que fazer:**
- Criar componente `CriativoForm.tsx`:
  - Radio buttons: tipo (Imagem | Texto | Headline)
  - Textarea: briefing (max 500 chars, counter)
  - Dropdown: tom/estilo (profissional, criativo, formal, etc)
  - Dropdown: segmento/alvo (e-commerce, SaaS, lifestyle, etc)
  - Checkbox: salvar como rascunho ou publicado
  - Button: "Gerar" (disabled durante loading)
  - Loading state com progress (mostra tokens usados)
- Handlear submitção: call API `/api/criativos/gerar`
- Mostra preview do resultado em modal/expandível

**Verificar:**
- Form valida briefing (não vazio)
- Botão Gerar desabilitado enquanto loading
- Preview mostra resultado (imagem/texto)
- Toast de sucesso

**Tempo:** 2h | **Responsável:** Frontend

---

### 1.1.6 - API: POST /api/criativos/gerar
**O que fazer:**
- Criar endpoint que:
  1. Valida input (briefing, tipo, tom, segmento)
  2. Checa rate limit (max 5 req/min por usuário)
  3. Chama Gemini com prompt customizado por tipo
  4. Salva em `criativos` table com status "rascunho"
  5. Retorna criativo_id + preview
- Tratamento de erro: Gemini indisponível → retorna 503 com mensagem

**Verificar:**
```bash
curl -X POST http://localhost:3000/api/criativos/gerar \
  -H "Content-Type: application/json" \
  -d '{"tipo":"text","briefing":"Slogan para app de finanças","tom":"criativo","segmento":"SaaS"}' \
# Retorna: {criativo_id, tipo, resultado, tokens_usados}
```

**Tempo:** 1.5h | **Responsável:** Backend

---

### 1.1.7 - Salvar e Publicar Criativo
**O que fazer:**
- Quando preview é aceito, salvar com: nome customizável, tags (auto-complete)
- Criar componente `SaveCriativoDialog.tsx`:
  - Input: nome (default: "Criativo - [timestamp]")
  - Input: tags (chip input)
  - Toggle: rascunho / publicado
  - Button: Salvar
- API: PUT `/api/criativos/:id` (atualizar status, tags, nome)

**Verificar:**
- Salva criativo com nome customizado
- Tags aparecem no card
- Status muda de rascunho → publicado

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### 1.1.8 - Histórico de Versões
**O que fazer:**
- Quando usuário "regenera" um criativo, salvar versão anterior
- Criar dropdown em card: "Ver versões" (últimas 5)
- Modal com timeline de versões
- Pode reverter para versão anterior (restaura e cria nova versão)
- API: GET `/api/criativos/:id/versoes`

**Verificar:**
- Gera criativo, regenera, dropdown mostra 2 versões
- Pode reverter

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### 1.1.9 - Gerenciamento: Deletar, Editar, Baixar, Compartilhar
**O que fazer:**
- Delete: confirma, soft delete (marcado como deletado)
- Edit: pop modal para editar nome, tags, descrição
- Download: exporta em alta qualidade (PNG se imagem, PDF se texto)
- Share: gera link público com token (expiração 7 dias)
  - Criar table: `criativo_compartilhamentos` (token, expirado_em)
  - Link público: `/criativos/compartilhado/:token`

**Verificar:**
- Delete → tira da lista
- Edit → salva mudanças
- Download funciona (arquivo baixa)
- Share → link copiado, funciona quando acessa

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 1.1.10 - Templates de Briefing
**O que fazer:**
- Criar `CriativoTemplates.tsx` (seção nova no painel)
- CRUD: criar, editar, deletar templates
- Templates pré-definidos: Social Media, Email, Landing Page
- Form usa template: auto-preenche briefing com placeholder
- API: GET/POST/PUT/DELETE `/api/templates-briefing`

**Verificar:**
- Lista templates
- Seleciona template → form auto-preenche
- Pode criar novo template customizado

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 1.1.11 - Testes e QA
**O que fazer:**
- Testes unitários: `generateCreativo`, `validarBriefing`
- Testes integração: criar criativo e-2-e (form → BD → list)
- Testar erros: API indisponível, rate limit, briefing inválido
- Testar performance: listar 1000 criativos (< 2s)

**Verificar:**
```bash
npm run test -- src/integrations/gemini
npm run test -- src/pages/admin/criativos
# Coverage: > 80%
```

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 1.1.12 - Configuração Gemini API no Admin Panel
**O que fazer:**
- Adicionar seção em SystemConfigManager.tsx: "Gemini API"
- Input para API key (salvo encriptado em Supabase)
- Validação com teste de conexão (botão "Testar")
- Display de: quotas restantes, modelos disponíveis
- Histórico de uso (últimos 30 dias)

**Verificar:**
- API key salvo
- Teste de conexão funciona
- Quotas mostram corretamente

**Tempo:** 1h | **Responsável:** Frontend

---

### **Critérios de Aceitação - Fase 1**

- ✅ Dashboard de criativos lista todos com filtros funcionando
- ✅ Form gera criativo via Gemini e mostra preview
- ✅ Criativo salvo em BD com nome customizado
- ✅ Histórico de versões (máximo 5) funciona
- ✅ Pode deletar, editar, baixar, compartilhar criativo
- ✅ Templates de briefing funcionam
- ✅ API key Gemini configurável no admin
- ✅ Rate limiting implementado (max 5 req/min por usuário)
- ✅ Testes com 80%+ coverage
- ✅ Zero erros no console
- ✅ Performance < 2s para listar 1000 criativos

---

# FASE 2: Sistema de Notificações Push

**Duração:** 2 semanas  
**Esforço:** 25 story points  
**Status:** Não iniciado  
**Dependência:** Nenhuma (Web Push API padrão)

## Objetivo
Implementar web push notifications nativa (sem Firebase) com segmentação de usuários, agendamento e métricas.

## Requisitos Funcionais (RF 2.1-2.5)

### 2.1.1 - Setup: Criar BD e tabelas
**O que fazer:**
- Migrations: `push_notifications`, `push_subscriptions`, `push_analytics`
- Adicionar RLS: usuário vê seus subscriptions apenas
- Admin vê todas as notificações

**Tempo:** 20min | **Responsável:** Backend

---

### 2.1.2 - Setup: Service Worker e Web Push API
**O que fazer:**
- Criar `public/sw.js` (service worker)
- Implementar: `self.addEventListener('push', handlePush)`
- Gerar VAPID keys (privada/pública) para servidor
- Armazenar VAPID pública em `window.env`
- Registrar SW no `App.tsx` no `useEffect`

```typescript
// src/hooks/usePushNotifications.ts
export function usePushNotifications() {
  const register = async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlencode(VAPID_PUBLIC)
    });
    return subscription;
  };
}
```

**Verificar:**
- SW registrado (DevTools → Application → Service Workers)
- Subscription criada (endpoint presente)

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 2.1.3 - Admin: Dashboard de Push Notifications
**O que fazer:**
- Criar `AdminPushNotifications.tsx` (seção nova no sidebar)
- Layout: tabela + filtros + stats
- Tabela: título, data enviada, usuários alcançados, taxa click, status
- Filtros: status, data range, busca
- Stats: total mês, taxa média abertura, total enviado

**Verificar:**
- Lista notificações (vazia no início)
- Filtros funcionam
- Stats atualizam

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 2.1.4 - Form para Criar/Enviar Notificação
**O que fazer:**
- Criar `PushNotificationForm.tsx`:
  - Input: título (max 50 chars, counter)
  - Textarea: mensagem (max 200 chars)
  - Upload: ícone (preview)
  - Input: URL de ação (destino ao clicar)
  - Segmentação: dropdown (Todos / Usuários específicos / Por critério)
  - Agendamento: radio (Agora / Específica / Recorrente)
    - Se específica: date + time picker
    - Se recorrente: dropdown (Semanal / Mensal) + dia
  - Preview em device mockup
  - Button: Enviar (com confirmação)

**Verificar:**
- Form valida campos
- Preview mostra corretamente
- Agendamento salvo

**Tempo:** 2h | **Responsável:** Frontend

---

### 2.1.5 - API: POST /api/push/send
**O que fazer:**
- Endpoint que:
  1. Valida input
  2. Se segmento = "Todos": seleciona todas subscriptions ativas
  3. Se segmento = "Específico": filtra por lista de user_ids
  4. Se segmento = "Critério": filtra por regra (ex: usuários pagos)
  5. Para cada subscription: chama `pushManager.sendNotification()`
  6. Registra evento em `push_analytics` com tipo "sent"
  7. Retorna: total enviado, falhas
- Retry automático em falha (max 3 vezes)

**Verificar:**
```bash
curl -X POST http://localhost:3000/api/push/send \
  -d '{"titulo":"Test","mensagem":"Testando","segmento":"todos"}' \
# Retorna: {enviado: 0, falhas: 0} (pois não há subscribers)
```

**Tempo:** 1.5h | **Responsável:** Backend

---

### 2.1.6 - Agendamento de Notificações
**O que fazer:**
- Se agendado: salvar com status "agendada" + timestamp
- Cron job a cada 1 min: busca notificações agendadas vencidas
- Executa `sendNotification()` e atualiza status → "enviada"
- Suportar recorrência: cria próxima instância se recorrente

**Verificar:**
- Agenda notificação para agora + 1 min
- Espera 1 min
- Notificação foi enviada

**Tempo:** 1h | **Responsável:** Backend

---

### 2.1.7 - Analytics: Registrar Eventos
**O que fazer:**
- Service Worker ao receber push: dispara evento "delivered"
- Service Worker ao clicar: dispara evento "clicked" (envia beacon)
- User app: ao descartar, dispara "dismissed"
- Backend track em `push_analytics`: notificacao_id, tipo, user_id, timestamp
- Calcula taxa: (clicked / sent) * 100

**Verificar:**
- Envia notificação
- Clica nela
- `push_analytics` registra evento "clicked"

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 2.1.8 - Limpeza de Subscriptions Inativas
**O que fazer:**
- Cron job diário: para cada subscription, tenta enviar ping
- Se falha por 3 vezes consecutivas: marca como inativa
- Remove do BD se inativa por > 30 dias
- Email alertando admin se > 20% das subscriptions inativas

**Verificar:**
- Simula subscription morta
- Após 30 dias (simular com SQL): removida

**Tempo:** 45min | **Responsável:** Backend

---

### 2.1.9 - Preferências de Usuário
**O que fazer:**
- Criar `UserPushPreferences` table: user_id, tipos_notificacao (json), horario_silencio_inicio, horario_silencio_fim
- Página no user app: Configurações → Notificações
  - Toggle por tipo (promoções, alertas, pedidos, etc)
  - Time picker: horário de silêncio (ex: 22:00 - 08:00)
- API: GET/PUT `/api/user/push-preferences`
- No envio, checar preferências: não envia se desabilitado ou em horário silêncio

**Verificar:**
- Usuário desabilita "Promoções"
- Tenta enviar promoção: não chega
- Em horário silêncio: não chega

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 2.1.10 - Unsubscribe
**O que fazer:**
- Cada notificação contém link "Gerenciar preferências"
- Link leva para `/push/preferences` (sem auth necessário, usa token)
- Token no URL: gerado com expiração 7 dias
- Página permite: desabilitar tipo, mudar horário silêncio, unsubscribe total
- Se unsubscribe: marca subscription como "inactive"

**Verificar:**
- Click em "Gerenciar" → leva para página
- Desabilita notificações → não recebe mais

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### 2.1.11 - Testes
**O que fazer:**
- Mock Web Push API
- Testes: enviar para todos, segmento, agendamento
- Testes de retry e falha
- Testes de limpeza de subscriptions
- E2E: registrar, enviar, clicar, analytics registrado

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 2**

- ✅ Service Worker registrado e funcional
- ✅ Web Push API integrada (sem Firebase)
- ✅ Admin pode criar e enviar notificação
- ✅ Segmentação de usuários funciona
- ✅ Agendamento (imediato, data/hora, recorrente) funciona
- ✅ Analytics registra: sent, delivered, clicked, dismissed
- ✅ Taxa de click calculada corretamente
- ✅ Usuário pode customizar preferências e horários
- ✅ Unsubscribe funciona (link na notificação)
- ✅ Subscriptions inativas limpas automaticamente
- ✅ Testes com 80%+ coverage
- ✅ Performance: enviar 1000 notificações < 5s

---

# FASE 3: Sistema de Tutorials/Guias

**Duração:** 2 semanas  
**Esforço:** 20 story points  
**Status:** Não iniciado  
**Dependência:** Nenhuma

## Objetivo
Implementar gerenciador de tutorials para onboarding com criação (admin), visualização (user), gamificação e analytics.

## Requisitos Funcionais (RF 3.1-3.5)

### 3.1.1 - Setup: Criar BD e tabelas
**O que fazer:**
- Migrations: `tutorials`, `tutorial_passos`, `tutorial_progresso_usuario`, `tutorial_feedback`
- Indexes: categoria_id, publicado, user_id
- RLS: usuários veem tutorials públicos, admin vê todos

**Tempo:** 20min | **Responsável:** Backend

---

### 3.1.2 - Admin: Editor de Tutorials
**O que fazer:**
- Criar `AdminTutorials.tsx` (seção novo no sidebar)
- Layout: lista de tutorials + editor
- Editor com: nome, descrição, categoria (dropdown), slug (auto, editável)
- Toggle: publicado / rascunho
- Seção "Passos": tabela com passos (drag-and-drop para reordenar)
- Button: "+ Novo Passo"
- Cada passo: título, conteúdo (markdown editor com preview), imagem, video URL

**Verificar:**
- Cria tutorial com 3 passos
- Arrastra para reordenar (ordem atualiza)
- Publica (muda status)

**Tempo:** 2.5h | **Responsável:** Frontend

---

### 3.1.3 - API: CRUD de Tutorials
**O que fazer:**
- POST `/api/tutorials`: cria novo
- PUT `/api/tutorials/:id`: atualiza
- DELETE `/api/tutorials/:id`: soft delete
- GET `/api/tutorials/:id`: pega um com passos
- GET `/api/tutorials?categoria=X&publicado=true`: lista filtrada

**Tempo:** 1h | **Responsável:** Backend

---

### 3.1.4 - User App: Listar Tutorials
**O que fazer:**
- Criar nova seção: "Ajuda" ou "Aprender"
- Página `/ajuda/tutorials` com:
  - Busca por título (debounced)
  - Filtro por categoria (chips)
  - Tags como chips (iniciante, intermediário, avançado)
  - Cards: tutorial thumbnail, título, categoria, progresso (X/Y passos)
  - Stats: X% completados no total

**Verificar:**
- Lista todos os tutorials publicados
- Filtro por categoria funciona
- Cards mostram progresso

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 3.1.5 - User App: Viewer de Tutorial
**O que fazer:**
- Criar `TutorialViewer.tsx`:
  - Breadcrumb: Ajuda > Categoria > Tutorial
  - Conteúdo do passo (markdown renderizado)
  - Imagem/video se presente
  - Navegação: botão "Anterior" / progresso (Passo X de Y) / botão "Próximo"
  - Se última passo: botão "Marcar como Completo"
  - Sidebar: lista de passos (clicável, atual em destaque)
- Salvar progresso a cada troca de passo

**Verificar:**
- Abre tutorial, navega 3 passos
- Barra de progresso atualiza
- Ao marcar completo, passo último desaparece

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 3.1.6 - API: Progresso do Usuário
**O que fazer:**
- POST `/api/tutorials/:id/progresso`: salva passo atual
- POST `/api/tutorials/:id/completar`: marca como completo
- GET `/api/user/progresso-tutorials`: lista de tutoriais + progresso
- Registra tempo que usuário levou (passo_X_ate_passo_Y = tempo)

**Verificar:**
```bash
curl -X POST http://localhost:3000/api/tutorials/1/progresso \
  -d '{"passo_atual": 2}' \
# Salva progresso
```

**Tempo:** 45min | **Responsável:** Backend

---

### 3.1.7 - Gamificação: Badges e Progresso
**O que fazer:**
- Badge "Tutorial Concluído" para cada tutorial (mostra no perfil)
- Stats: X/Y tutorials completados (% geral)
- Criar table: `badges` (id, nome, icone, tipo) e `user_badges` (user_id, badge_id)
- Ao completar um tutorial: concede badge
- Página `/perfil/badges`: mostra badges conquistadas

**Verificar:**
- Completa tutorial → badge aparece
- Página de perfil mostra badge

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### 3.1.8 - Leaderboard (Opcional)
**O que fazer:**
- Página `/ajuda/leaderboard`: top 10 usuários por:
  - Mais tutorials completados
  - Mais rápido (menor tempo médio)
- Mostra rank do usuário logado
- Atualiza diariamente

**Verificar:**
- Listar top 10
- Usuário logado vê seu rank

**Tempo:** 1h | **Responsável:** Frontend

---

### 3.1.9 - Feedback e Rating
**O que fazer:**
- No fim do tutorial (passo final): mostra "Como achou esse tutorial?" com 5 stars
- Textarea opcional: comentário
- Salva em `tutorial_feedback`
- Admin vê feedback no editor de tutorial

**Verificar:**
- Completa tutorial
- Rating form aparece
- Salva feedback

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### 3.1.10 - Admin: Analytics de Tutorials
**O que fazer:**
- Seção no admin: "Analytics de Tutorials"
- Métricas por tutorial: views, completados, taxa de conclusão, tempo médio, feedback médio
- Gráfico de drop-off (quantos param em cada passo)
- Filtro por data range
- Exportar relatório (CSV)

**Verificar:**
- Mostra top 3 tutorials mais completados
- Drop-off visualizado

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 3.1.11 - Testes
**O que fazer:**
- Testes CRUD tutorials
- Testes de progresso e conclusão
- E2E: criar tutorial, completar, badge aparece

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 3**

- ✅ Admin pode criar tutorial com múltiplos passos
- ✅ Passos podem ser reordenados via drag-and-drop
- ✅ Usuário pode abrir tutorial e navegar passos
- ✅ Progresso salvo (pode fechar e continuar depois)
- ✅ Badge concedida ao completar
- ✅ Rating de 5 stars funciona
- ✅ Admin vê analytics (views, conclusões, drop-off)
- ✅ Leaderboard mostra top 10
- ✅ Testes com 80%+ coverage
- ✅ Performance: carregar tutorial < 500ms

---

# FASE 4: Gerenciamento Avançado de Categorias

**Duração:** 2 semanas  
**Esforço:** 20 story points  
**Status:** Não iniciado  
**Dependência:** Fase 0 (estrutura existente)

## Objetivo
Expandir categorias com subcategorias, regras automáticas, limites de gasto e análise.

## Requisitos Funcionais (RF 4.1-4.5)

### 4.1.1 - Setup: Migrar tabela categorias
**O que fazer:**
- Migration: adicionar a `categorias` table:
  - `categoria_pai_id` (self-reference, nullable)
  - `nivel_hierarquia` (1 ou 2)
  - `limite_mensal` (decimal, nullable)
  - `limite_anual` (decimal, nullable)
  - `alerta_percentual` (int, default 80)
  - `bloquer_se_exceder` (boolean, default false)
  - `arquivada` (boolean, default false)
- Criar indexes: `categoria_pai_id`, `arquivada`

**Tempo:** 20min | **Responsável:** Backend

---

### 4.1.2 - Frontend: Editor de Categorias Hierárquico
**O que fazer:**
- Expandir `CategoryManagement.tsx` ou criar `AdvancedCategoryForm.tsx`
- Mostrar categorias em árvore (parent → children)
- Form com:
  - Nome, cor, ícone (existente)
  - Dropdown: "Categoria pai" (ou nenhuma)
  - Inputs: limite mensal, limite anual
  - Slider: alerta percentual (default 80%)
  - Checkbox: bloquer se exceder
  - Checkbox: arquivada
- Drag-and-drop para mover categoria (mudar pai)

**Verificar:**
- Cria categoria pai
- Cria subcategoria dentro
- Árvore mostra hierarquia

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 4.1.3 - Regras de Categorização Automática
**O que fazer:**
- Nova seção: "Regras de Categorização"
- Form para criar regra: 
  - Condição: se keyword X in descrição → categorizar em Y
  - Inputs: palavra-chave (pode ser múltiplas, separadas por |)
  - Dropdown: categoria destino
  - Slider: prioridade (1-10)
  - Toggle: ativa/inativa
- Tabela: lista regras com ações (editar, deletar, testar)
- Botão: "Testar em histórico" (mostra quantas transações seriam recategorizadas)

**Verificar:**
- Cria regra
- Testa em histórico (mostra preview)

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 4.1.4 - API: Regras de Categorização
**O que fazer:**
- POST `/api/categoria-regras`: criar
- PUT `/api/categoria-regras/:id`: atualizar
- DELETE `/api/categoria-regras/:id`: deletar
- POST `/api/categoria-regras/:id/testar`: testa em histórico (retorna count)
- POST `/api/categoria-regras/:id/aplicar`: aplica em batch (retorna count atualizado)
- Endpoint: GET `/api/categorias/hierarchy`: retorna árvore completa

**Tempo:** 1.5h | **Responsável:** Backend

---

### 4.1.5 - Backend: Aplicar Regras Automáticas
**O que fazer:**
- Ao criar transação: checar regras (ordem por prioridade)
- Se palavra-chave encontrada → auto-categorizar
- Trigger no banco: antes de inserir transação, chamar função que aplica regras
- Se múltiplas regras match: usar primeira (maior prioridade)

**Tempo:** 1h | **Responsável:** Backend

---

### 4.1.6 - Alertas de Limites
**O que fazer:**
- Cron job diário (ou real-time ao adicionar transação):
  - Para cada categoria com limite: calcula gasto do mês
  - Se gasto >= (alerta% * limite): cria notificação/alerta
  - Se bloquer_se_exceder && gasto > limite: marca transação como "Bloqueada"
- Componente: `CategoryLimitAlert.tsx` no dashboard
  - Mostra categorias próximas ao limite (warning)
  - Mostra categorias que excederam (erro)

**Verificar:**
- Cria categoria com limite 100 / alerta 80%
- Insere transação de 85
- Alert aparece no dashboard

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 4.1.7 - Dashboard de Distribuição
**O que fazer:**
- Criar `CategoryDistributionDashboard.tsx`:
  - Gráfico pizza: % de gasto por categoria
  - Gráfico coluna: comparação mês-a-mês por top 5 categorias
  - Tabela: categoria, gasto, % do total, tendência (↑ ↓ →), limite se existe
  - Filtro: data range
  - Insights: "Maior gasto em X", "X a mais que mês passado"

**Verificar:**
- Gráfico pizza mostra distribuição
- Comparação mês-mês funciona
- Tendências calculadas corretamente

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 4.1.8 - Ações Avançadas: Renomear, Mesclar, Duplicar
**O que fazer:**
- Renomear: input modal, atualiza histórico (log de mudanças)
- Mesclar: modal seleciona categoria A + B, confirma, move todas transações de B para A, deleta B
- Duplicar: cria cópia com mesmo config, nome = "[Original] - Cópia"
- Arquivar: ao arquivar, não aparece em dropdowns mas mantém histórico
- Delete permamente: soft delete (não exclui histórico)

**Verificar:**
- Renomeia categoria → transações antigas refletem
- Mescla duas categorias → transações movidas
- Arquiva categoria → não aparece em novo form

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 4.1.9 - Análise de Tendências
**O que fazer:**
- Componente: `CategoryTrendsChart.tsx`
- Mostra últimos 12 meses de gasto por categoria (linha chart)
- Identifica: aumentando (last 3 months avg > prev 3), diminuindo, estável
- Projeção: se mantiver ritmo, quanto vai gastar no ano?
- Recomendação: "X aumentou 50% em 3 meses, considere revisar"

**Verificar:**
- Gráfico mostra 12 meses
- Tendência identificada corretamente

**Tempo:** 1h | **Responsável:** Frontend

---

### 4.1.10 - Sugestões de Limpeza
**O que fazer:**
- Analytics: categorias sem transações há > 6 meses
- Alert no admin: "5 categorias não utilizadas, arquivar?"
- Recomendação: mesclar categorias similares (ex: "Alimentação" + "Comida")

**Tempo:** 1h | **Responsável:** Backend

---

### 4.1.11 - Testes
**O que fazer:**
- Testes: CRUD categorias, subcategorias, regras
- Testes de limites e alertas
- Testes de tendências

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 4**

- ✅ Subcategorias (2 níveis) funcionam
- ✅ Regras de categorização automática funcionam
- ✅ Limites por categoria enforcados
- ✅ Alertas aparecem quando próximo/excede limite
- ✅ Dashboard de distribuição com 3+ gráficos
- ✅ Tendências de 12 meses calculadas
- ✅ Ações avançadas (renomear, mesclar, duplicar, arquivar) funcionam
- ✅ Testes com 80%+ coverage

---

# FASE 5: Roadmap de Desenvolvimento (Público/Interno)

**Duração:** 1.5 semana  
**Esforço:** 15 story points  
**Status:** Não iniciado  
**Dependência:** Nenhuma

## Objetivo
Implementar dashboard público/interno de roadmap com votação, timeline e changelog.

## Requisitos Funcionais (RF 5.1-5.5)

### 5.1.1 - Setup: Criar tabelas
**O que fazer:**
- Migrations: `roadmap_items`, `roadmap_votos`, `releases_changelog`
- RLS: público pode ver, votar; admin edita

**Tempo:** 15min | **Responsável:** Backend

---

### 5.1.2 - Admin: Gerenciador de Roadmap
**O que fazer:**
- Criar `AdminRoadmap.tsx` (seção novo no sidebar)
- Tabela/Cards com roadmap items
- Form para criar/editar: título, descrição, categoria (dropdown), status, data estimada, prioridade
- Drag-and-drop para reordenar
- Mudar de trimestre (visual timeline)
- Notas internas (admin only)
- Preview público

**Verificar:**
- Cria item de roadmap
- Status: Planejado → Desenvolvimento → Beta → Lançado
- Pode arrastar entre trimestres

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 5.1.3 - Página Pública de Roadmap
**O que fazer:**
- Criar rota `/roadmap` (pública, sem auth)
- Cards de items com: título, descrição, status (cor), votos (botão com ícone coração)
- Filtro: status, categoria (chips)
- Busca por palavra-chave
- Top 5 mais votados em destaque
- Se logado: pode votar (1 voto por item, pode remover)

**Verificar:**
- Página pública acessível
- Filtra por status
- Vote/unvote funciona se logado

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 5.1.4 - API de Votação
**O que fazer:**
- POST `/api/roadmap/:id/votar`: adiciona voto (UNIQUE constraint user+item)
- DELETE `/api/roadmap/:id/votar`: remove voto
- GET `/api/roadmap?sort=votos`: retorna ordenado por votos
- GET `/api/roadmap/top-5`: top 5 mais votados

**Tempo:** 45min | **Responsável:** Backend

---

### 5.1.5 - Timeline Visual
**O que fazer:**
- Criar componente `RoadmapTimeline.tsx`
- Mostra itens agrupados por trimestre (Q1/Q2/Q3/Q4)
- Cards com cores por status (planejado=cinza, dev=azul, beta=amarelo, lançado=verde)
- Drag-and-drop para mover entre trimestres (apenas admin)
- Click em card: expande mostrando descrição completa

**Verificar:**
- Mostra 4 trimestres
- Cards com cores corretas
- Drag-and-drop funciona (admin)

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 5.1.6 - Changelog
**O que fazer:**
- Criar `ReleasesChangelog.tsx`:
  - Listar releases em ordem reversa (recentes primeiro)
  - Card com: versão (semver), data, features, bugs fixes
  - Busca/filtro por versão
  - Link para cada release (permalink)
- Ao mudar item de roadmap para "Lançado": criar release automaticamente

**Verificar:**
- Lista releases (vazio no início)
- Marca item como lançado → release criado

**Tempo:** 1h | **Responsável:** Frontend

---

### 5.1.7 - Notificação de Votantes
**O que fazer:**
- Quando item vai de "Desenvolvimento" → "Lançado": 
  - Identificar todos que votaram
  - Enviar notificação push (se subscrito): "Feature que você votou foi lançada! (item.titulo)"
- Email opcional (bonus)

**Tempo:** 1h | **Responsável:** Backend

---

### 5.1.8 - Feedback dos Usuários
**O que fazer:**
- Criar `RoadmapFeedback.tsx`:
  - Modal para deixar comentário em item
  - Mostrar comentários (publicamente ou admin-only?)
  - Rating de "Quer mesmo?" (1-5 stars)
- Admin vê: engagement por item, feedback

**Tempo:** 1h | **Responsável:** Frontend

---

### 5.1.9 - Testes
**O que fazer:**
- Testes CRUD roadmap
- Testes de votação
- E2E: votar, item lançado, notificação enviada

**Tempo:** 45min | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 5**

- ✅ Dashboard admin de roadmap com CRUD funcional
- ✅ Página pública mostra items, filtro, busca
- ✅ Sistema de votação funciona (usuários logados)
- ✅ Timeline visual com 4 trimestres
- ✅ Drag-and-drop de items entre trimestres (admin)
- ✅ Changelog com releases
- ✅ Notificação push quando feature lançada
- ✅ Testes com 80%+ coverage

---

# FASE 6: Agente de IA Avançado (Evolution AI Agent)

**Duração:** 3 semanas  
**Esforço:** 30 story points  
**Status:** Não iniciado  
**Dependência:** Fase 1 (Criativos, para setup de IA), Evolution API existente

## Objetivo
Expandir agente de IA com análise de gastos, sugestões automáticas, relatórios via WhatsApp, e aprendizado progressivo.

## Requisitos Funcionais (RF 6.1-6.5)

### 6.1.1 - Setup: Análise de Dados do Usuário
**O que fazer:**
- Criar função `analyzeUserSpending(user_id)` que:
  - Busca transações últimos 12 meses
  - Calcula: média mensal, desvio padrão, sazonalidade
  - Identifica anomalias (> 2 desvios padrão)
  - Detecta padrões (ex: sempre gasta em X na 1ª semana)
  - Cache por 24h
- Armazenar análise em table: `user_spending_analysis` (user_id, analise_json, criado_em)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 6.1.2 - Sugestões Automáticas
**O que fazer:**
- Criar função `generateSuggestions(user_id, analysis)` que:
  - Compara categoria atual vs. média histórica
  - Gera frases: "Você gastou 30% a mais em X este mês"
  - Se projeto excedera meta: "Você vai gastar R$500 a mais em Y se continuar"
  - Sugere meta: "Sua economia média é R$X, considere meta de R$Y"
- Armazena sugestões em table: `ai_suggestions` (user_id, tipo, conteudo, prioridade, criado_em)
- Prioriza top 3 sugestões por relevância

**Tempo:** 1.5h | **Responsável:** Backend

---

### 6.1.3 - Dashboard de Insights (User App)
**O que fazer:**
- Criar seção no dashboard: "Insights da IA"
- Cards com: 
  - Anomalia detectada (ex: "Gasto X% a mais em Alimentação")
  - Sugestão (ex: "Você vai exceder Categoria Y em R$500")
  - Meta (ex: "Meta sugerida: poupar R$X/mês")
- Botão "Mais detalhes" expande em modal
- Feedback: "Útil" / "Não útil" (para aprendizado)

**Verificar:**
- Dashboard mostra insights
- Click em card → modal com detalhes
- Feedback salvo

**Tempo:** 1h | **Responsável:** Frontend

---

### 6.1.4 - Relatórios Automáticos via WhatsApp
**O que fazer:**
- Criar `WhatsAppAIReporter.ts`:
  - Função que gera resumo semanal/mensal
  - Formato: "📊 Resumo da Semana\nGasto: R$X\nTopCategorias: ...\n📈 Economia: R$Y"
  - Integra com Evolution API (existente)
  - Agenda: segunda 9:00 (ou configurável)
- Cron job agenda envios
- Table: `whatsapp_reports_agendados` (user_id, frequencia, proximo_envio)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 6.1.5 - Integração com Conversas WhatsApp
**O que fazer:**
- Evolution API listener: ao receber mensagem
- Parser de comandos: `/gastos`, `/meta`, `/alerta`, `/recomendacao`
  - `/gastos categoria=Alimentação` → "Você gastou R$X em Alimentação"
  - `/meta` → "Meta atual: R$Y, atingido: R$Z (X%)"
  - `/alerta` → "Você vai exceder em: Categoria A (R$X), Categoria B (R$Y)"
  - `/recomendacao` → "Sugestão: reduza gasto em X em 20%"
- IA responde em tempo real (max 2s)

**Verificar:**
- Simula mensagem WhatsApp: `/gastos`
- Bot responde com valor correto

**Tempo:** 1.5h | **Responsável:** Backend

---

### 6.1.6 - Aprendizado Progressivo
**O que fazer:**
- Criar table: `ai_feedback` (user_id, suggestion_id, util (boolean), criado_em)
- Ao receber feedback:
  - Se útil: aumentar score da sugestão (para próximas)
  - Se não útil: diminuir score
  - Rastrear tipos de sugestão mais úteis por usuário
- Personalizar relatórios: incluir sugestões com alto score
- Profile de risco: se usuário ignora alertas, avisar mais cedo

**Tempo:** 1h | **Responsável:** Backend

---

### 6.1.7 - Cache e Performance
**O que fazer:**
- Análise de gasto: cache 24h (ou invalidar se nova transação > R$500)
- Sugestões: cache 12h
- Relatórios: gerados 1x/semana (não recalcula toda vez)
- Redis para cache

**Tempo:** 1h | **Responsável:** Backend

---

### 6.1.8 - Testes
**O que fazer:**
- Testes: análise, sugestões, geração de relatórios
- Mocks: transações de teste
- E2E: usuário recebe relatório por WhatsApp

**Tempo:** 1.5h | **Responsável:** Backend

---

### **Critérios de Aceitação - Fase 6**

- ✅ Análise de gastos detecta anomalias e padrões
- ✅ Sugestões automáticas geradas (top 3 por relevância)
- ✅ Dashboard mostra insights
- ✅ Relatórios semanais/mensais enviados via WhatsApp
- ✅ Comandos WhatsApp funcionam (/gastos, /meta, /alerta, /recomendacao)
- ✅ Aprendizado progressivo: sugestões melhoram com feedback
- ✅ Testes com 80%+ coverage

---

# FASE 7: Integrações Adicionais

**Duração:** 4 semanas  
**Esforço:** 35 story points  
**Status:** Não iniciado  
**Dependência:** Nenhuma (cada integração independente)

## Objetivo
Implementar integrações com Open Banking, CRM, Email Marketing, e Webhooks.

## Requisitos Funcionais (RF 7.1-7.4)

### 7.1.1 - Open Banking: Selecionar Banco
**O que fazer:**
- Integração com Pluggy (https://pluggy.ai) ou Tink (https://tink.com)
- Admin panel: nova seção "Open Banking"
- Form: selecionar banco (dropdown com logos)
- Botão: "Conectar Banco"
- Redirect para flow de autenticação (OAuth)
- Callback: salva credenciais encriptadas em table: `open_banking_connections` (user_id, provider, access_token_encrypted, conta_id)

**Verificar:**
- Botão abre flow de banco
- Callback salva token

**Tempo:** 2h | **Responsável:** Backend

---

### 7.1.2 - Sincronização Automática
**O que fazer:**
- Cron job (diário às 2:00 AM): para cada user com Open Banking:
  1. Busca transações novas do banco
  2. Cria transações em app (auto-categoriza via regras)
  3. Se já existe (duplicado): não duplica (checa por valor+data+descrição)
  4. Marca como "Importada do banco"
- Table: `transacoes` adicionar campo `origem` (manual | banco | app_integracao)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 7.1.3 - Reconciliação Automática
**O que fazer:**
- Comparar: saldo BD vs. saldo banco
- Se diferença > 0.01: alerta admin
- Dashboard: "Saldo conciliado: ✓ Última atualização: 2h atrás"
- Se não concilia: "⚠️ Diferença de R$X, revisar"

**Tempo:** 1.5h | **Responsável:** Backend

---

### 7.1.4 - CRM Light
**O que fazer:**
- Criar table: `crm_contatos` (id, nome, email, telefone, tags, notas, criado_em)
- Página: `/admin/crm`
  - Lista de contatos com busca/filtro por tags
  - Form para adicionar contato
  - Histórico de interações (mensagens, emails enviados)
- Integração: ao enviar email marketing, cria interação

**Tempo:** 1.5h | **Responsável:** Frontend + Backend

---

### 7.1.5 - Email Marketing (Brevo/Mailchimp)
**O que fazer:**
- Admin panel: integração com Brevo (https://www.brevo.com/api/)
- Form para enviar campanha:
  - Selecionar template (dropdown)
  - Segmentação (todos, tags específicas, custom filter)
  - Preview
  - Schedule (agora ou data/hora)
- Track: aberturas, clicks (via webhooks do Brevo)

**Tempo:** 2h | **Responsável:** Backend

---

### 7.1.6 - Webhook Outbound
**O que fazer:**
- Table: `webhooks_configurados` (id, url, eventos (json array), ativa, secret_key)
- Admin panel: seção "Webhooks"
- Form: URL + checkbox de eventos (new_transaction, meta_reached, user_joined, etc)
- Ao evento: POST para URL com payload assinado (HMAC-SHA256)
- Table: `webhook_logs` (id, webhook_id, status, response_time, payload, criado_em)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 7.1.7 - Retry e Confiabilidade
**O que fazer:**
- Falhas no webhook: retry com exponential backoff (1s, 2s, 4s, 8s, máx 5 vezes)
- Email: retry se falha (3 vezes)
- Open Banking: if sync falha, retry próxima vez

**Tempo:** 1h | **Responsável:** Backend

---

### 7.1.8 - Testes
**O que fazer:**
- Testes: mocks de APIs (Pluggy, Brevo)
- E2E: conectar banco simulado, sincronizar

**Tempo:** 1.5h | **Responsável:** Backend

---

### **Critérios de Aceitação - Fase 7**

- ✅ Open Banking: conecta banco e sincroniza transações automaticamente
- ✅ Reconciliação detecta diferenças
- ✅ CRM light funciona (CRUD contatos, histórico)
- ✅ Email marketing integrado com Brevo
- ✅ Webhooks outbound configuráveis e funcionando
- ✅ Retry automático em falhas
- ✅ Testes com 80%+ coverage

---

# FASE 8: Analytics e Relatórios Avançados

**Duração:** 2.5 semanas  
**Esforço:** 25 story points  
**Status:** Não iniciado  
**Dependência:** Dados de transações existentes

## Objetivo
Implementar dashboard de analytics, gerador de relatórios customizados, export (PDF/CSV/Excel), e forecasting.

## Requisitos Funcionais (RF 8.1-8.5)

### 8.1.1 - Dashboard de KPIs
**O que fazer:**
- Criar componente `AnalyticsDashboard.tsx`:
  - Cards com KPIs: gasto total, economia, # transações, ticket médio
  - Período selecionável (mensal, trimestral, anual, custom)
  - Comparação com período anterior
- Filtros: categoria, tipo (entrada/saída)

**Verificar:**
- Cards mostram valores corretos
- Comparação período-a-período precisa

**Tempo:** 1h | **Responsável:** Frontend

---

### 8.1.2 - Gráficos Avançados
**O que fazer:**
- Usar Recharts (ou Chart.js):
  - Gráfico linha: evolução do gasto (diário/semanal/mensal)
  - Gráfico pizza: distribuição por categoria
  - Gráfico coluna: comparação mês-a-mês
  - Gráfico área: cash flow (entradas vs. saídas)
- Cada gráfico com: tooltip, legenda, export (PNG)

**Verificar:**
- Gráficos renderizam com dados
- Export PNG funciona

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 8.1.3 - Builder de Relatórios
**O que fazer:**
- Criar `ReportBuilder.tsx`:
  - Seleção visual: quais métricas incluir (checkboxes)
  - Dimensões: agrupar por categoria, período, tipo
  - Filtros: data range, categoria, tags
  - Botão: "Preview" → mostra relatório
  - Botão: "Salvar" → salva template com nome
- Table: `relatorio_templates` (user_id, nome, config_json, criado_em)

**Verificar:**
- Cria relatório customizado
- Preview correto
- Salva template

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 8.1.4 - Export (PDF, CSV, Excel)
**O que fazer:**
- Usar bibliotecas: pdfkit (PDF), xlsx (Excel)
- Para cada tipo:
  - PDF: logo, título, data, tabelas, gráficos
  - CSV: formato simples (para análise em Excel)
  - Excel: múltiplas sheets (resumo, detalhes, gráficos)
- Assinatura digital (opcional, pode ficar para futuro)

**Verificar:**
```bash
# No browser: clica "Exportar PDF"
# Arquivo baixa e abre corretamente
```

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 8.1.5 - Agendamento de Relatórios
**O que fazer:**
- Form: "Agendar relatório"
  - Seleciona template
  - Frequência: semanal, mensal
  - Dia/hora
  - Email para enviar
- Cron job: gera e envia relatório automaticamente
- Table: `relatorios_agendados` (template_id, frequencia, proximo_envio, email)

**Tempo:** 1h | **Responsável:** Backend

---

### 8.1.6 - Benchmarking
**O que fazer:**
- Comparar gasto vs. média Brasil/região (usar dados públicos ou estimativas)
- Dashboard mostra: "Você gasta X% menos/mais que a média"
- Identificar outliers em categorias: "Você gasta muito em X comparado com média"
- Sugestão: "Reduzindo X em 20% economizaria R$Y/mês"

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 8.1.7 - Forecasting
**O que fazer:**
- Usar função: análise histórica + sazonalidade
- Projeta próximos 3 meses baseado em padrão
- Mostra gráfico com projeção (linha pontilhada)
- Margem de confiança (95%, 80%)
- Alerta se projeção > orçamento

**Tempo:** 1.5h | **Responsável:** Backend

---

### 8.1.8 - Testes
**O que fazer:**
- Testes de cálculos (KPIs, forecasting)
- Testes de export
- E2E: gera relatório, exporta, arquivo correto

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 8**

- ✅ Dashboard KPIs com 4+ cards
- ✅ Gráficos (linha, pizza, coluna, área) renderizando
- ✅ Builder de relatórios customizados funciona
- ✅ Export PDF, CSV, Excel funcionando
- ✅ Agendamento de relatórios automático
- ✅ Benchmarking mostra comparação
- ✅ Forecasting projeta 3 meses
- ✅ Testes com 80%+ coverage

---

# FASE 9: Performance e Otimizações

**Duração:** 2 semanas  
**Esforço:** 20 story points  
**Status:** Não iniciado  
**Dependência:** Fases 1-8 (aplica ao código completo)

## Objetivo
Otimizar performance, segurança, e escalabilidade do sistema.

## Requisitos Funcionais (RF 9.1-9.5)

### 9.1.1 - Cache com Redis
**O que fazer:**
- Implementar Redis para cache:
  - Queries frequentes: categorias do usuário (TTL 24h)
  - Análises: user_spending_analysis (TTL 24h)
  - Sugestões: ai_suggestions (TTL 12h)
- Invalidação: ao criar transação, invalida cache de gasto
- Monitor: dashboard mostrando hit-rate

**Verificar:**
```bash
# Redis CLI
KEYS grana360:user:*  # Mostra keys
TTL grana360:user:123:categories  # Mostra TTL
```

**Tempo:** 1.5h | **Responsável:** Backend

---

### 9.1.2 - CDN para Assets
**O que fazer:**
- Integrar com Cloudflare/CloudFront
- Servir: imagens, CSS, JS minificado
- Cache headers: 1 ano para versionados, 1 dia para index.html
- Verificar compressão (gzip, brotli)

**Tempo:** 1h | **Responsável:** Backend

---

### 9.1.3 - Índices de Banco de Dados
**O que fazer:**
- Analyze queries lentas (>100ms):
  - Transações por usuário: INDEX (user_id, criado_em DESC)
  - Categorias por usuário: INDEX (user_id, arquivada)
  - Analytics: INDEX (user_id, categoria_id, criado_em)
- Criar índices compostos
- Remove índices não usados

**Tempo:** 1h | **Responsável:** Backend

---

### 9.1.4 - Query Optimization
**O que fazer:**
- Audit N+1 problems (ORM queries)
- Implementar: select fields (não SELECT *), eager loading
- Usar: LIMIT em listagems, pagination
- Prepared statements (segurança + performance)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 9.1.5 - Code Splitting e Lazy Loading
**O que fazer:**
- Webpack: split por rota (admin/ separado de user/)
- Lazy load: imagens (IntersectionObserver)
- Minificação: CSS/JS
- Tree shaking: remover código não usado

**Verificar:**
```bash
npm run build
# Bundle size < 500kb (comprimido)
```

**Tempo:** 1.5h | **Responsável:** Frontend

---

### 9.1.6 - APM (Application Performance Monitoring)
**O que fazer:**
- Integrar com: Sentry (errors) + New Relic/Datadog (APM)
- Rastrear: API response time, queries lentas, JS errors
- Alertas: se response time > 1s

**Tempo:** 1h | **Responsável:** Backend

---

### 9.1.7 - Segurança
**O que fazer:**
- Rate limiting em APIs: 100 req/min por IP
- CORS: configurar whitelist
- Input validation: sanitizar tudo
- Encriptação: dados sensíveis (API keys, PII)
- Audit logs: todas ações críticas (deletar, transferência $)

**Tempo:** 1.5h | **Responsável:** Backend

---

### 9.1.8 - Testes de Performance
**O que fazer:**
- Load test: 1000 requisições simultâneas → < 2s response
- Lighthouse: score > 90
- Bundle size: < 500kb comprimido

**Tempo:** 1h | **Responsável:** Frontend + Backend

---

### **Critérios de Aceitação - Fase 9**

- ✅ Redis cache implementado (hit-rate > 70%)
- ✅ CDN servindo assets
- ✅ Índices de BD criados
- ✅ N+1 problems resolvidos
- ✅ Code splitting reduz bundle size
- ✅ APM monitorando performance
- ✅ Rate limiting ativo
- ✅ Load test: 1000 req < 2s
- ✅ Lighthouse score > 90
- ✅ Zero vulnerabilidades de segurança

---

# FASE 10: Deploy e Monitoramento

**Duração:** 2 semanas  
**Esforço:** 15 story points  
**Status:** Não iniciado  
**Dependência:** Fases 1-9 (integrações completas)

## Objetivo
Automatizar deploy, monitoramento contínuo, backup, e disaster recovery.

## Requisitos Funcionais (RF 10.1-10.5)

### 10.1.1 - CI/CD Pipeline (GitHub Actions)
**O que fazer:**
- Criar `.github/workflows/deploy.yml`:
  1. **Build:** npm install, npm run build
  2. **Tests:** npm run test (coverage > 80%)
  3. **Lint:** eslint src/
  4. **Deploy Staging:** push para staging automaticamente
  5. **Manual Deploy Prod:** require approval na UI
  6. **Rollback:** se falha, revert para versão anterior
- Matrix: build para node 18, 20

**Verificar:**
```bash
# Pushar para main → GitHub Actions roda
# Validar: tests passam, build sucesso
```

**Tempo:** 1.5h | **Responsável:** Backend

---

### 10.1.2 - Ambientes (Dev, Staging, Prod)
**O que fazer:**
- Estrutura: 3 Supabase projects (dev, staging, prod)
- Secrets: armazenar em GitHub Secrets (env vars)
- Deploy:
  - Dev: manual (local)
  - Staging: automático (main branch)
  - Prod: manual (require approval + tag de versão)
- Database migrations: executar automaticamente

**Tempo:** 1h | **Responsável:** Backend

---

### 10.1.3 - Health Checks
**O que fazer:**
- Endpoint: GET `/api/health` (retorna status de: API, DB, Redis, Open Banking)
- Cron job: ping a cada 5 min
- Alertas: se algum down

**Verificar:**
```bash
curl http://localhost:3000/api/health
# {api: "ok", db: "ok", redis: "ok"}
```

**Tempo:** 30min | **Responsável:** Backend

---

### 10.1.4 - Monitoramento (Logs, Métricas, Alertas)
**O que fazer:**
- Logs: agregados em Datadog/Loki
  - Filtros: por nível (info, warn, error), componente
  - Search: buscar por requisição ID
- Alertas: 
  - CPU > 80%
  - Memória > 80%
  - Response time > 1s
  - Error rate > 1%
  - Uptime < 99%
- Dashboard público: `/status` mostrando uptime

**Tempo:** 1.5h | **Responsável:** Backend

---

### 10.1.5 - Backup e Disaster Recovery
**O que fazer:**
- Supabase: backups automáticos diários
- S3: backup de files (retenção 30 dias)
- Plan: RTO 4h, RPO 1h
- Teste mensal: restore de backup (documentado)
- Runbook: passos para disaster recovery

**Tempo:** 1h | **Responsável:** Backend

---

### 10.1.6 - Auto-Scaling
**O que fazer:**
- Container: Docker para app (se não estiver)
- Kubernetes: auto-scale baseado em CPU
- Database: connection pooling
- Load balancer: distribuir tráfego

**Tempo:** 1.5h | **Responsável:** Backend

---

### 10.1.7 - Versionamento e Releases
**O que fazer:**
- Semantic versioning: MAJOR.MINOR.PATCH
- Tag Git: v1.0.0, v1.1.0, etc
- Changelog: CHANGELOG.md atualizado
- Release notes: notas de lançamento no GitHub

**Tempo:** 30min | **Responsável:** Backend

---

### 10.1.8 - Documentação de Deployment
**O que fazer:**
- README: passos para deploy local
- DEPLOYMENT.md: passos para prod
- MONITORING.md: como usar dashboards
- DISASTER_RECOVERY.md: plano de recuperação

**Tempo:** 1h | **Responsável:** Backend

---

### **Critérios de Aceitação - Fase 10**

- ✅ CI/CD pipeline automático (GitHub Actions)
- ✅ Deploy automático para staging
- ✅ Deploy manual com aprovação para prod
- ✅ Rollback automático se falha
- ✅ Health checks funcionando
- ✅ Monitoramento (logs, métricas, alertas) ativo
- ✅ Backups automáticos diários
- ✅ Auto-scaling configurado
- ✅ Documentação completa
- ✅ Uptime > 99.5%

---

# 📋 Matriz de Dependências e Timeline

```
FASE 1 (Criativos IA)          [3 semanas]
FASE 2 (Push Notifications)    [2 semanas]  
FASE 3 (Tutorials)             [2 semanas]
FASE 4 (Categorias Avançadas)  [2 semanas]
FASE 5 (Roadmap Público)       [1.5 semana]
FASE 6 (IA Agent Avançado)     [3 semanas] → depende de Fase 1
FASE 7 (Integrações)           [4 semanas] → independente
FASE 8 (Analytics)             [2.5 semanas] → independente
FASE 9 (Performance)           [2 semanas] → após Fases 1-8
FASE 10 (Deploy)               [2 semanas] → após Fases 1-9

PARALELO:
- Fases 1-5 podem rodar em paralelo (equipes diferentes)
- Fase 7 independente
- Fase 8 independente
- Fases 6, 9, 10 sequenciais

TOTAL: 12-14 semanas (aprox. 3 meses)
```

---

# 🎯 Roadmap Executivo

| Fase | Status | Semanas | Points | Prioridade | Bloqueadores |
|------|--------|---------|--------|------------|--------------|
| 1    | 📋     | 3       | 40     | 🔴 Alta   | Nenhum      |
| 2    | 📋     | 2       | 25     | 🟡 Média  | Nenhum      |
| 3    | 📋     | 2       | 20     | 🟡 Média  | Nenhum      |
| 4    | 📋     | 2       | 20     | 🟡 Média  | Nenhum      |
| 5    | 📋     | 1.5     | 15     | 🟡 Média  | Nenhum      |
| 6    | 📋     | 3       | 30     | 🟢 Baixa  | Fase 1      |
| 7    | 📋     | 4       | 35     | 🟢 Baixa  | Nenhum      |
| 8    | 📋     | 2.5     | 25     | 🟡 Média  | Nenhum      |
| 9    | 📋     | 2       | 20     | 🟡 Média  | Fases 1-8   |
| 10   | 📋     | 2       | 15     | 🔴 Alta   | Fases 1-9   |

**Legend:** 📋 Não iniciado | ⏳ Em Progresso | ✅ Concluído

---

# 📚 Documentos de Referência

- [MISSING_FEATURES_SPEC.md](./MISSING_FEATURES_SPEC.md) - Especificação detalhada de cada feature
- Este documento - Plano de implementação granular

---

**Próximos Passos:**
1. ✅ Revisar este plano com time
2. ⏳ Estimar T-shirt sizes (S/M/L/XL)
3. ⏳ Definir timeboxes específicas
4. ⏳ Criar issues no GitHub para cada sub-tarefa
5. ⏳ Iniciar Fase 1 (Criativos) - maior impacto
