# Grana360 Admin - Especificação de Funcionalidades Faltantes

**Data:** 2026-04-24  
**Versão:** 1.0  
**Status:** Planejamento

---

## 1. Módulo de Criativos/IA (Criativos Infinitos)

### Visão Geral
Gerenciador de criativos de marketing que usa IA (Gemini) para gerar materiais criativos (imagens, textos, headlines) para campanhas publicitárias e materiais de marketing.

### Requisitos Funcionais

#### RF1.1 - Dashboard de Criativos
- Exibir lista de criativos criados com: nome, tipo (imagem/texto), status, data criação
- Buscar/filtrar criativos por: nome, tipo, data
- Indicador de criativos recentes (últimos 7 dias)
- Estatísticas: total de criativos, criativos por tipo

#### RF1.2 - Integração com Gemini API
- Configurar API key do Google Gemini (tela de config)
- Endpoints para gerar: imagens (via Imagen), textos, headlines
- Validação de créditos/quotas da API
- Tratamento de erros com retry automático
- Cache de respostas por 24h

#### RF1.3 - Gerador de Conteúdo
- Form para: tipo de criativo, briefing (descrição), tom/estilo, segmento (alvo)
- Suportar gerações em batch (múltiplas simultâneas)
- Preview antes de salvar
- Opções de regenerar/refinar resultado
- Histórico de versões (manter últimas 5)

#### RF1.4 - Gerenciamento de Criativos
- Salvar criativos em banco de dados
- Editar metadados (nome, tags, descrição)
- Deletar com confirmação
- Exportar criativo (download em alta qualidade)
- Compartilhamento via link público (com expiração)

#### RF1.5 - Templates
- CRUD de templates de briefing
- Templates pré-configurados para: social media, email, landing page
- Duplicação de criativos existentes como base

### Tabelas de Banco de Dados
```sql
criativos (
  id, nome, tipo (image|text|headline), 
  briefing_id, resultado_json, status (rascunho|publicado),
  versao, criado_em, atualizado_em, user_id
)

criativo_versoes (
  id, criativo_id, numero_versao, resultado_json, 
  criado_em, motivo_mudanca
)

templates_briefing (
  id, nome, tipo, estrutura_json, default_values,
  criado_em, atualizado_em
)
```

### Integração com Existing
- Admin panel: nova seção "Criativos" no sidebar
- Usar banco Supabase existente
- Auth: reuso de AdminRoute.tsx
- Padrão de componentes: usar componentes UI existentes (Card, Button, Dialog)

---

## 2. Sistema de Notificações Push

### Visão Geral
Sistema para enviar notificações push para usuários que optaram por receber. Inclui gerenciamento de campanhas, histórico e métricas de engajamento.

### Requisitos Funcionais

#### RF2.1 - Dashboard de Push Notifications
- Listar notificações enviadas com: título, data, usuários alcançados, taxa de click
- Filtrar por: status (rascunho/enviada/agendada), data range
- Buscar por palavra-chave no título
- Estatísticas: notificações no mês, taxa média de abertura

#### RF2.2 - Envio de Notificações
- Form para criar notificação: título (max 50 chars), mensagem, ícone, URL de destino
- Preview em diferentes devices
- Segmentação: enviar para todos / usuários específicos / por critério
- Agendamento: imediato / data/hora específica / recorrente (semanal/mensal)
- Confirmação antes de enviar

#### RF2.3 - Integração com Web Push API
- Implementar Web Push API nativa (não terceiros)
- Service Worker para receber e exibir notificações
- Gerenciamento de permissões de usuário
- Fallback para notificações in-app se push negado
- Armazenar subscriptions de push no banco

#### RF2.4 - Métricas e Analytics
- Registrar: enviado, entregue, clicado, descartado
- Taxa de click por notificação
- Comportamento pós-click (qual página visitou)
- Retry automático se falha na entrega
- Limpeza de subscriptions inativas (>30 dias sem device)

#### RF2.5 - Gerenciamento de Preferências
- Usuário pode ativar/desativar notificações por tipo
- Horário de silêncio configurável (não enviar entre X-Y)
- Unsubscribe fácil (link em notificação)
- Painel de preferências no app do usuário

### Tabelas de Banco de Dados
```sql
push_notifications (
  id, titulo, mensagem, icone_url, action_url,
  status (rascunho|agendada|enviada|falhou),
  agendada_para, enviada_em, usuarios_alcancados,
  criado_por (admin_id), criado_em
)

push_subscriptions (
  id, user_id, endpoint, auth_key, p256dh_key,
  ativa (boolean), ultimo_ping_em, criado_em
)

push_analytics (
  id, notificacao_id, tipo_evento (sent|delivered|clicked|dismissed),
  user_id, timestamp, metadata_json
)
```

### Integração com Existing
- Admin panel: nova seção "Notificações" no sidebar
- Hook no app do usuário: implementar Service Worker
- Usar Web Push API padrão (sem Firebase)
- Supabase para armazenar subscriptions

---

## 3. Sistema de Tutorials/Guias

### Visão Geral
Gerenciador de tutoriais e guias interativos para onboarding de usuários. Inclui criação, publicação e tracking de visualizações.

### Requisitos Funcionais

#### RF3.1 - Gerenciador de Tutorials (Admin)
- CRUD completo de tutorials: título, descrição, categoria, passos
- Cada tutorial contém múltiplos passos com: título, conteúdo (markdown), imagem/screenshot, video (opcional)
- Ordenar passos via drag-and-drop
- Publicar/despublicar tutorial
- Preview do tutorial antes de publicar

#### RF3.2 - Viewer de Tutorials (User App)
- Listar tutorials disponíveis com busca/filtro por categoria
- Exibir tutorial com navegação entre passos (anterior/próximo)
- Progress bar mostrando passo atual
- Salvar progresso (continuar depois)
- Marcar tutorial como completo

#### RF3.3 - Categorias e Tags
- Gerenciar categorias de tutorials (ex: Onboarding, Recursos, Dicas)
- Atribuir tags a tutoriais (ex: iniciante, intermediário, avançado)
- Filtrar por category/tag no viewer
- Recomendações baseadas em ações do usuário

#### RF3.4 - Gamificação
- Badge "Tutorial Concluído" por tutorial
- Progresso geral (X% de tutorials completados)
- Leaderboard de tutoriais (top tutoriais visualizados)
- Sistema de pontos (opcional)

#### RF3.5 - Analytics
- Registrar: views por tutorial, conclusões, tempo médio, drop-off por passo
- Dashboard mostrando tutorials menos populares
- Feedback: usuário pode classificar tutorial (5 stars)
- Sugestões de melhorias baseado em feedback

### Tabelas de Banco de Dados
```sql
tutorials (
  id, titulo, descricao, categoria_id, slug,
  publicado (boolean), criado_em, atualizado_em,
  criado_por (admin_id)
)

tutorial_passos (
  id, tutorial_id, numero_passo, titulo, conteudo_markdown,
  imagem_url, video_url, ordem
)

tutorial_progresso_usuario (
  id, user_id, tutorial_id, passo_atual, concluido (boolean),
  conclusao_em, criado_em, atualizado_em
)

tutorial_feedback (
  id, user_id, tutorial_id, rating (1-5), comentario,
  criado_em
)
```

### Integração com Existing
- Admin panel: nova seção "Tutorials" no sidebar
- User app: new section "Ajuda/Tutorials"
- Sistema de auth existente
- Markdown rendering (usar existing markdown lib)

---

## 4. Gerenciamento Avançado de Categorias

### Visão Geral
Expandir o sistema de categorias atual com suporte a subcategorias, regras de organização automática, limites por categoria e análise de distribuição.

### Requisitos Funcionais

#### RF4.1 - Subcategorias
- Criar categorias pai/filha (até 2 níveis)
- Editar estrutura hierárquica
- Herança de propriedades (cor, ícone)
- Transações podem estar em categoria ou subcategoria

#### RF4.2 - Regras de Categorização Automática
- Criar regras: se keyword X em descrição → categorizar em Y
- Regras por padrão (ex: "Aluguel" → Casa)
- Múltiplas regras possíveis (prioridade)
- Teste de regra antes de aplicar
- Aplicar regras retroativamente (em batch)

#### RF4.3 - Limites e Alertas
- Definir limite de gasto por categoria (mensal/anual)
- Alerta quando atinge X% do limite
- Bloqueio de transação se excede (configurável)
- Dashboard mostrando: gasto atual vs limite, % utilizado

#### RF4.4 - Análise de Distribuição
- Gráfico de % de gasto por categoria
- Comparativo mês-a-mês por categoria
- Tendências (aumentando/diminuindo)
- Categorias sem transações (sugestão de remover)

#### RF4.5 - Gestão de Categorias
- Renomear categoria (atualizar histórico)
- Mesclar duas categorias (perguntar para onde)
- Duplicar categoria com configurações
- Arquivar categoria (não usa mais, mantém histórico)

### Campos Adicionais em Tabelas
```sql
ALTER TABLE categorias ADD (
  categoria_pai_id (nullable),
  nivel_hierarquia (1-2),
  limite_mensal (decimal),
  limite_anual (decimal),
  alerta_percentual (int, default 80),
  bloquer_se_exceder (boolean, default false),
  arquivada (boolean, default false),
  regras_categorizacao_json
)
```

### Integração com Existing
- Expandir CategoryForm.tsx existente
- Adicionar novas coluna à tabela categorias
- Usar componentes UI existentes
- Atualizar CategoryManagement.tsx

---

## 5. Roadmap de Desenvolvimento (Público/Interno)

### Visão Geral
Dashboard público e interno mostrando roadmap de features futuras, status de desenvolvimento, votação de usuários e changelog.

### Requisitos Funcionais

#### RF5.1 - Dashboard Público de Roadmap
- Exibir features planejadas com: título, descrição, status (planejado/desenvolvimento/beta/lançado)
- Votar em features (1 voto por usuário, renovável)
- Filtrar por: status, categoria
- Search por palavra-chave
- Mostrar top 5 features mais votadas

#### RF5.2 - Gerenciador de Roadmap (Admin)
- CRUD de itens de roadmap
- Definir: título, descrição, categoria, status, data estimada, prioridade
- Ordenação customizada
- Adicionar notas internas (não públicas)
- Marcar como "Completed" com changelog

#### RF5.3 - Timeline Visual
- Exibir roadmap em timeline (Q1/Q2/Q3/Q4)
- Cards agrupados por trimestre
- Cores por status/categoria
- Arrastável entre trimestres (apenas admin)

#### RF5.4 - Changelog
- Listar histórico de releases
- Cada release com: versão, data, features adicionadas, bugs corrigidos
- Agrupação por data
- Busca/filtro por versão ou feature
- Publicação automática quando item de roadmap → "Lançado"

#### RF5.5 - Votação e Feedback
- Notificar votantes quando feature que votaram é lançada
- Feedback dos usuários por feature (comentários)
- Dashboard admin mostrando: features votadas, feedback, engagement

### Tabelas de Banco de Dados
```sql
roadmap_items (
  id, titulo, descricao, categoria, status (planejado|desenvolvimento|beta|lancado),
  data_estimada, prioridade, votos_total, notas_internas,
  criado_em, atualizado_em
)

roadmap_votos (
  id, user_id, roadmap_item_id, criado_em,
  UNIQUE(user_id, roadmap_item_id)
)

releases_changelog (
  id, versao (semver), data_lancamento, descricao,
  features_json, bugs_json, criado_em
)
```

### Integração com Existing
- Nova página pública: `/roadmap`
- Admin panel: nova seção "Roadmap"
- User app: pode votar (precisa estar logado)
- Usar componentes UI existentes

---

## 6. Agente de IA Avançado (Evolution AI Agent)

### Visão Geral
Expansão do Agente de IA existente com capacidades: análise de gastos, recomendações personalizadas, sugestões automáticas de economia, relatórios automáticos via WhatsApp.

### Requisitos Funcionais

#### RF6.1 - Análise Inteligente de Gastos
- IA analisa padrões de gasto do usuário
- Detecta: anomalias, gastos incomuns, padrões sazonais
- Recomendações: "Você gastou 30% a mais em alimentação este mês"
- Comparações: mês anterior, ano anterior, média histórica

#### RF6.2 - Agente de Sugestões
- Sugerir economia (ex: "Sua maior categoria é X, considerou X alternativa?")
- Alertas automáticos: "Você vai exceder categoria Z se continuar neste ritmo"
- Recomendações de metas (ex: "Meta de economia para setembro: R$500")
- Sugestões de planejamento (ex: "Julho tem gastos altos, considere poupança preventiva")

#### RF6.3 - Relatórios Automáticos via WhatsApp
- IA gera resumo semanal/mensal: total gasto, top categorias, economia
- Envia via Evolution API/WhatsApp
- Formato: markdown com emojis
- Agendado (ex: toda segunda-feira às 9:00)
- Usuário pode customizar frequência

#### RF6.4 - Integração com Conversas WhatsApp
- Usuário pergunta: "Quanto gastei em alimentação?"
- IA responde com: valor, % do total, tendência
- Comandos: `/gastos`, `/meta`, `/alerta`, `/recomendacao`
- Contexto: IA lembra de conversas anteriores (últimos 7 dias)

#### RF6.5 - Aprendizado Progressivo
- IA melhora sugestões com base em ações do usuário
- Se usuário segue sugestão A, aumenta relevância
- Se ignora sugestão B, reduz frequência
- Profile de risco/conservadorismo

### Requisitos Técnicos
- Usar Gemini API (ou Claude API)
- Integrar com Supabase para histórico
- Evolution API para WhatsApp
- Cron jobs para relatórios automáticos
- Cache de análises por 24h

### Integração com Existing
- Expandir arquivo Evolution API existente (tela11)
- Usar contexto de transações existentes
- Manter histórico de interações
- Respeitar horários de silêncio (RF2.5)

---

## 7. Integrações Adicionais

### Visão Geral
Expansão de integrações externas: Open Banking, CRM, Email Marketing, e outros.

### Requisitos Funcionais

#### RF7.1 - Open Banking (Brasil)
- Integrar com Pix automático (já tem PIX manual)
- Conectar com bancos (via Pluggy ou Tink): sincronização automática de transações
- Reconciliação automática (banco vs. app)
- Alertas de diferenças/discrepâncias
- Suporte inicial: 2-3 bancos

#### RF7.2 - CRM Light
- Registrar clientes/prospects
- Histórico de interações
- Tags de segmentação
- Exportar lista para email marketing

#### RF7.3 - Email Marketing
- Integração com Brevo/Mailchimp
- Enviar campanhas direto do admin
- Templates pré-feitos
- Analytics de abertura/click

#### RF7.4 - Webhook Outbound
- Enviar eventos para sistemas externos
- Eventos: nova transação, meta atingida, novo usuário
- Retry automático
- Logs de webhook (request/response)

### Tabelas
```sql
integracao_configs (
  id, tipo (open_banking|crm|email|webhook),
  config_json (credenciais encriptadas),
  ativa (boolean), criado_em
)

webhook_logs (
  id, integracao_id, evento, payload_json,
  status_response, tentativas, proximo_retry, criado_em
)
```

### Integração com Existing
- Admin panel: seção de "Integrações"
- Usar SecretKeyManager.tsx existente para credenciais
- Padrão de componentes existente

---

## 8. Analytics e Relatórios Avançados

### Visão Geral
Dashboard de analytics e gerador de relatórios customizados com export (PDF, CSV, Excel).

### Requisitos Funcionais

#### RF8.1 - Dashboard de Analytics
- KPIs: gasto total, economia, número de transações, ticket médio
- Gráficos: evolução do gasto (linha), distribuição por categoria (pizza), cash flow (coluna)
- Filtros: data range, categoria, tipo (entrada/saída)
- Comparação período-a-período
- Projeção para fim do mês

#### RF8.2 - Relatórios Customizados
- Builder visual: selecionar: métricas, dimensões, filtros
- Templates pré-configurados: Mensal, Trimestral, Anual
- Agendamento de relatórios (automático via email)
- Versionamento de relatórios (salvar e reutilizar)

#### RF8.3 - Export
- PDF com logo/branding
- CSV para análise externa
- Excel com múltiplas sheets
- Gráficos inclusos (PDF/Excel)
- Assinatura digital (opcional)

#### RF8.4 - Benchmarking
- Comparar gastos vs. média (Brasil, região, perfil similar)
- Identificar outliers em categorias
- Sugestão de redução baseado em benchmark

#### RF8.5 - Forecasting
- Projeção de gastos para próximos 3 meses
- Baseado em histórico + sazonalidade
- Margem de confiança
- Alertas se projeção excede orçamento

### Bibliotecas
- Gráficos: Chart.js ou Recharts (já usa?)
- PDF: pdfkit ou html2pdf
- Excel: xlsx ou exceljs

### Integração com Existing
- User app: dashboard já existe, expandir
- Admin panel: adicionar seção "Analytics"
- Reusar dados de TransactionsTable.tsx

---

## 9. Performance e Otimizações

### Visão Geral
Melhorias de performance, segurança, e escalabilidade.

### Requisitos Funcionais

#### RF9.1 - Cache e CDN
- Cache em memória para queries frequentes (Redis)
- CDN para assets estáticos
- Invalidação inteligente de cache
- Metrics de hit-rate

#### RF9.2 - Otimização de Banco de Dados
- Índices em colunas frequentemente filtradas
- Sharding/particionamento se necessário
- Query optimization (N+1 problems)
- Prepared statements para segurança

#### RF9.3 - Compressão e Minificação
- Gzip em respostas
- Minificação de JS/CSS
- Lazy loading de imagens
- Code splitting (webpack)

#### RF9.4 - Monitoramento de Performance
- APM (Application Performance Monitoring)
- Alertas se response time > X ms
- Rastreamento de queries lentas
- Error tracking e alertas

#### RF9.5 - Segurança
- Rate limiting em APIs
- CORS configurado corretamente
- Validação de input rigorosa
- Encriptação de dados sensíveis
- Audit logs de ações críticas

---

## 10. Deploy e Monitoramento

### Visão Geral
Infraestrutura de deploy automatizado, monitoramento contínuo e disaster recovery.

### Requisitos Funcionais

#### RF10.1 - CI/CD Automatizado
- Build automático em cada push
- Testes automatizados (unit, integration)
- Deploy para staging automático
- Deploy para produção com aprovação manual
- Rollback automático se falha

#### RF10.2 - Ambientes
- Development (local)
- Staging (pre-prod, testa antes)
- Production (users finais)
- Each com suas credenciais/secrets

#### RF10.3 - Monitoramento
- Health checks periódicos (API, DB, Storage)
- Alertas: CPU, memória, disco, latência
- Log aggregation e search
- Uptime monitoring (público/privado)

#### RF10.4 - Backup e Disaster Recovery
- Backups automáticos diários do banco
- Backup de arquivos/assets
- Retenção: 7 dias diários, 4 semanas semanais
- Teste de restore mensal
- RTO/RPO definidos

#### RF10.5 - Scaling e Load Balancing
- Horizontal scaling (mais servidores)
- Load balancer automático
- Auto-scaling baseado em CPU/memória
- Database connection pooling

### Integração com Existing
- Usar infraestrutura existente (Supabase, vercel?, AWS?)
- Documentar secrets e credenciais
- Automação via GitHub Actions

---

## Matriz de Dependências

```
Fase 1 (Criativos) → [IA API setup]
Fase 2 (Push) → [Service Worker, Web APIs]
Fase 3 (Tutorials) → [Auth existente]
Fase 4 (Categorias) → [Banco existente]
Fase 5 (Roadmap) → [Banco existente]
Fase 6 (IA Agent) → [Fase 1 (Criativos), Evolution API existente]
Fase 7 (Integrações) → [Cada integração independente]
Fase 8 (Analytics) → [Dados de transações existentes]
Fase 9 (Performance) → [Código existente]
Fase 10 (Deploy) → [Todas as fases anteriores]
```

---

## Priorização Recomendada

1. **Alto impacto, Baixo esforço:** Fase 5 (Roadmap), Fase 3 (Tutorials)
2. **Alto impacto, Alto esforço:** Fase 1 (Criativos), Fase 6 (IA Agent)
3. **Médio impacto, Baixo esforço:** Fase 4 (Categorias), Fase 8 (Analytics)
4. **Suporte/Infra:** Fase 9 (Performance), Fase 10 (Deploy)

---

## Próximos Passos

1. Revisar este spec com time
2. Estimar T-shirt size para cada fase
3. Definir timeboxes (2-4 semanas por fase)
4. Criar issues no GitHub/Linear para cada fase
5. Iniciar Fase 1 ou Fase 3 (priority)
