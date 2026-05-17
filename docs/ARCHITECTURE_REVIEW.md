# Grana360 Admin - Revisão Arquitetônica

**Data:** 2026-04-24  
**Revisor:** Senior Architect  
**Status:** ✅ Validado com Recomendações

---

## 📊 Análise Executiva

O plano de implementação proposto é **arquitetonicamente sólido** com organização clara de fases e dependências. Identificadas **5 pontos críticos** com recomendações para otimizar escalabilidade, segurança e performance.

---

## 🎯 Ponto Crítico 1: Organização de Fases e Dependências

### ✅ O que está bom:
- Fases bem separadas com responsabilidades claras
- Dependências mapeadas explicitamente (Fase 6 → Fase 1, Fase 10 → Todas)
- Paralelização inteligente: Fases 1-5, 7-8 podem rodar simultaneamente
- Timeline realista: 12-14 semanas para 10 fases

### ⚠️ Recomendações:

#### 1.1 - Adicionar "Fase 0: Setup de Infraestrutura"
**Problema:** Fases 1-10 assumem que Redis, CDN, logging estão prontos, mas Fase 9-10 implementam.

**Solução:**
```markdown
FASE 0: Infrastructure Foundation [1 semana, 10 points]
- Setup: Redis, Logging (Datadog/Sentry)
- Setup: CDN (Cloudflare)
- Setup: Database indexes iniciais
- Pré-requisito: Fases 1-10

Timeline ajustado: 13-15 semanas (inclui Fase 0)
```

#### 1.2 - Criar Sub-Fase de Integração Cross-Features
**Problema:** Fase 6 (IA Agent) precisa de dados de Fase 4 (Categorias), mas não documentado.

**Solução:**
Após Fase 5, adicionar "Fase 5.5: Integration Testing" (3 dias):
- Testar dados Fase 1-5 funcionando juntos
- Validar APIs de dados para Fase 6-8
- Identificar edge cases antes de Fases 6-8

#### 1.3 - Definir "Critério de Pronto" por Fase
Cada fase deve ter:
- ✅ Testes 80%+ coverage
- ✅ Documentação técnica (README em pasta da feature)
- ✅ Zero issues críticos em QA
- ✅ Performance benchmark atingido (< Xms)
- ✅ Code review aprovado (2 pessoas)

**Impacto:** Evita débitos técnicos acumulando.

---

## 🏗️ Ponto Crítico 2: Escalabilidade da Arquitetura

### ✅ O que está bom:
- Cache com Redis identificado (Fase 9)
- CDN para assets (Fase 9)
- Índices de BD propostos
- Rate limiting em APIs
- Auto-scaling planejado

### ⚠️ Recomendações:

#### 2.1 - Padrão de Event-Driven para Escalabilidade
**Problema:** Fases 6, 7, 10 envolvem jobs assíncronos (relatórios, webhooks, sincronização de banco) que rodam em cron jobs simples.

**Solução - Event Queue Architecture:**
```
Evento: nova_transacao_criada
  ↓
RabbitMQ / Bull Queue
  ↓
Workers (múltiplos):
  - Analytics Worker (calcula stats)
  - IA Worker (gera sugestões)
  - Webhook Worker (dispara webhooks)
  - Notification Worker (envia push)
  
Benefício: Escalável, desacoplado, retry automático
Implementação: Fase 0 (setup), usado por Fases 1-10
Libs: bull (Node.js) ou Celery (Python)
```

#### 2.2 - Arquitetura de Data Warehouse para Analytics
**Problema:** Fase 8 (Analytics) roda queries complexas sobre tabela `transacoes` que pode ter milhões de registros. Slows down OLTP queries.

**Solução - OLAP Separado:**
```
OLTP (Operacional):
  - Supabase (transações em tempo real)
  - Índices para queries frequentes

OLAP (Analytics):
  - BigQuery / ClickHouse (data warehouse)
  - Pipeline: Supabase → BigQuery (daily batch ou streaming)
  - Queries de analytics rodam no BigQuery
  - Dashboards em Metabase/Looker usam BigQuery

Benefício: Analytics rápidas, OLTP não afetada
Implementação: Fase 8, integração com pipeline ETL
Timeline: 2 semanas adicionais em Fase 8
```

#### 2.3 - Rate Limiting e Throttling por Tier
**Problema:** Fase 10 propõe rate limiting simples (100 req/min), mas Fase 2-6 podem gerar bursts (notificações, IA).

**Solução - Token Bucket com Tiers:**
```yaml
Free Tier:
  - 50 req/min
  - 5 criativos/dia (Fase 1)
  - 10 notificações/mês (Fase 2)

Pro Tier:
  - 500 req/min
  - 50 criativos/dia
  - 1000 notificações/mês

Implementation:
  - Redis com script Lua para token bucket
  - Fase 0: setup, usado por todas
```

#### 2.4 - Replicação de BD para Disaster Recovery
**Problema:** Fase 10 propõe backups diários, mas RTO 4h pode ser longo.

**Solução:**
```
Primary: Supabase (Brasil, São Paulo)
Replica: Supabase (standby, hot)
  - Replicação em tempo real
  - Failover automático < 1 min
  - Multi-region backup (S3 global)
  
RTO: < 1 min (failover automático)
RPO: < 5 min (replicação real-time)

Custo adicional: ~30% Supabase
Timeline: Implementar em Fase 0 ou 10
```

---

## 🎨 Ponto Crítico 3: Padrões de Design (Monolítico vs Microservices)

### ✅ Decisão Recomendada: Monolítico com Módulos

**Por quê:**
- Equipe pequena/média (3-5 pessoas)
- Domínio fortemente acoplado (financeiro)
- Deploy simples, debugging fácil
- Sem overhead de microservices

**Estrutura Proposta:**
```
src/
├── modules/
│   ├── criativos/         [Fase 1]
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── db.ts (queries)
│   ├── push-notifications/[Fase 2]
│   ├── tutorials/         [Fase 3]
│   ├── categorias-avancado/ [Fase 4]
│   ├── roadmap/           [Fase 5]
│   ├── ai-agent/          [Fase 6]
│   ├── integraces/        [Fase 7]
│   │   ├── open-banking/
│   │   ├── email-marketing/
│   │   ├── webhooks/
│   ├── analytics/         [Fase 8]
│   ├── admin/
│   └── common/ (shared)
├── integrations/
│   ├── gemini.ts          [IA/Criativos]
│   ├── evolution-api.ts   [WhatsApp]
│   ├── stripe.ts          [Pagamentos]
│   └── ...
├── lib/
│   ├── cache.ts           [Redis]
│   ├── queue.ts           [Bull/RabbitMQ]
│   ├── logger.ts          [Logging centralizado]
│   └── ...
├── middleware/
│   ├── auth.ts
│   ├── rate-limit.ts      [Fase 10]
│   ├── audit-log.ts       [Segurança]
│   └── ...
├── types/
└── utils/
```

**Por Fase:**
```
Fase 1-5:  Adicionar novo módulo
Fase 6:    Expandir ai-agent/
Fase 7:    Expandir integrações/
Fase 8:    Adicionar analytics/
Fase 9:    Otimizar modules/ existentes (não nova estrutura)
Fase 10:   Deploy/Monitoring de tudo acima
```

### ⚠️ Quando Considerar Microservices (Futuro)

Se crescer para:
- 20+ engenheiros
- Alta escalabilidade de IA (Fase 6) isolada
- Times independentes por domínio

Então: Extrair IA Agent para serviço separado (recomendado ano 2).

---

## 💾 Ponto Crítico 4: Fluxo de Dados (Transações → Analytics → IA)

### ✅ O que está bom:
- Transações armazenadas em Supabase
- Analytics em Fase 8 processam histórico
- IA Agent em Fase 6 analisa gastos

### ⚠️ Recomendações:

#### 4.1 - Data Pipeline Documentado
**Criar diagrama explícito:**

```
USER CREATES TRANSACTION
    ↓
API: POST /transacoes
    ↓
Validação + Categorização automática (Fase 4 regras)
    ↓
INSERT transacoes table + evento "transacao.criada"
    ↓
EVENT QUEUE (Bull/RabbitMQ)
    ├→ Analytics Worker: atualiza cache de stats
    ├→ IA Worker (Fase 6): atualiza spending analysis
    ├→ Webhook Worker (Fase 7): dispara webhooks
    └→ Notification Worker (Fase 2): pode enviar alerta se excede limite
    ↓
Cada worker atualiza seu cache/aggregation
    ↓
Queries de leitura (dashboard, relatórios) leem cache + agregações
    ↓
BigQuery (Fase 8): batch ETL diário atualiza data warehouse
    ↓
Analytics Dashboard (Fase 8) consulta BigQuery
```

**Implementação:**
- Fase 0: Setup event queue
- Fases 1-8: Cada uma adiciona workers ao pipeline
- Fase 9: Otimização de performance

#### 4.2 - Sincronização com Open Banking (Fase 7)
**Problema:** Transação do banco chega via Open Banking sync. Como evitar duplicação?

**Solução:**
```
Open Banking Sync (cron diário):
    ↓
Para cada transação do banco:
    ↓
Buscar em transacoes com:
    - amount = valor
    - data = data
    - descricao LIKE parte do texto
    - origem != 'banco' (já não é importada)
    ↓
Se achou: SKIP (já existe)
Se não achou: INSERT com origem='banco' + origem_id=banco_id
    ↓
Trigger "transacao.criada" dispara evento
    ↓
Event queue processa como acima

Benefit: Idempotente, pode rodar múltiplas vezes
```

#### 4.3 - Data Consistency para Relatórios
**Problema:** Fase 8 gera relatório que precisa de dados consistentes. Fase 2-7 podem estar processando em paralelo.

**Solução:**
```
Transacoes table adiciona:
  - processing_status (pending | processing | done)
  - processed_at timestamp

Querys de leitura:
  SELECT * FROM transacoes
  WHERE processing_status = 'done'
  
Analytics gera relatório apenas com transações processadas
Evita relatórios parciais/inconsistentes
```

---

## 🔒 Ponto Crítico 5: Segurança e Conformidade

### ✅ O que está bom:
- Rate limiting planejado
- Encriptação de dados sensíveis
- Audit logs mencionados
- RLS no Supabase

### ⚠️ Recomendações Críticas:

#### 5.1 - LGPD Compliance (Lei Geral de Proteção de Dados)
**Problema:** App processa dados financeiros pessoais de brasileiros. Precisa estar 100% compliant com LGPD.

**Solução - Checklist LGPD:**

```
✅ Consentimento:
   - Usuário aceita T&Cs com opt-in de dados
   - Log de consentimento em table: `consent_logs`
   - Fase 0 ou 1: implementar

✅ Direito de Acesso:
   - Endpoint: GET /api/user/meus-dados
   - Retorna: todas transações, categorias, preferências
   - Export em JSON
   - Fase 0: implementar

✅ Direito ao Esquecimento:
   - Endpoint: DELETE /api/user/conta/delete-permanente
   - Soft delete: usuario marcado como deletado
   - Hard delete após 30 dias (legal hold)
   - Fase 0: implementar

✅ Portabilidade:
   - GET /api/user/export-data
   - Export em JSON/CSV com toda história
   - Fase 0: implementar

✅ Notificação de Vazamento:
   - Se há data breach: notificar usuários dentro 72h
   - Plano de resposta documentado (DISASTER_RECOVERY.md)
   - Fase 10: implementar

✅ Privacidade by Design:
   - Apenas coletar dados necessários (minimização)
   - Encriptação de PII em banco
   - Retenção limitada (max 5 anos de histórico)
   - Pseudonimização onde possível
   - Fases 0-10: implementar gradualmente

✅ Responsável de Dados (DPO):
   - Indicar DPO na página de privacidade
   - Email: dpo@grana360.com
   - Documentar politicas em PRIVACY.md
   - Fase 0: documentar
```

#### 5.2 - PCI Compliance (se processar cartão)
**Problema:** Fase 7 menciona Stripe, que processa pagamentos. Se app toca em dados de cartão, precisa PCI-DSS.

**Solução:**
```
Recomendação: NÃO tocar em dados de cartão
  - Usar Stripe.js (tokenização no cliente)
  - Tokenizar no browser, enviar token para backend
  - Backend nunca vê número do cartão
  - Stripe handle PCI, não você
  
Se usar Open Banking (Fase 7):
  - Dados sensíveis são do banco, não seu
  - Usar provider confiável (Pluggy, Tink)
  - Assinar SLA de segurança

Status: ✅ Seguro se implementar assim
```

#### 5.3 - Auditoria e Logging
**Problema:** Fase 10 menciona audit logs, mas não detalhado.

**Solução:**
```sql
-- Tabela audit_logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  user_id uuid,
  acao VARCHAR (50),           -- 'criar_transacao', 'deletar_categoria', etc
  recurso VARCHAR(50),         -- 'transacao', 'categoria', 'user'
  recurso_id uuid,
  dados_antigos jsonb,         -- para UPDATE/DELETE
  dados_novos jsonb,           -- para CREATE/UPDATE
  ip_origem inet,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- Ações a logar:
- DELETE (sempre)
- UPDATE de dados sensíveis (valor, descrição)
- LOGIN (falhas e sucessos)
- EXPORT de dados
- ADMIN actions (tudo)
- DELETE de usuário
```

**Implementação:**
- Fase 0: criar tabela + trigger em DELETE
- Fases 1-10: adicionar logging por recurso crítico
- Fase 10: dashboard de audit logs para admins

#### 5.4 - Encriptação de Dados Sensíveis
**Problema:** API keys de Gemini, Stripe, Open Banking armazenadas em BD. Se BD leaka, tudo leaka.

**Solução:**
```
Dados que DEVEM ser encriptados em BD:
  - API keys (Gemini, Stripe, etc)
  - Access tokens (Open Banking)
  - Senhas (nunca em BD! usar auth provider)
  - PII se permitido (CPF, endereço)

Implementação:
  1. Usar envelope encryption:
     - Data key: aleatória por row
     - Master key: AWS KMS ou HashiCorp Vault
  2. Supabase pode: usar Vault extension
  3. Lib: libsodium.js para JS/Node
  
Fase 0: setup, Fases 1-7: implementar por recurso
```

#### 5.5 - Rate Limiting por Integrações
**Problema:** Fase 1 chama Gemini API, Fase 7 chama Open Banking, Fase 2 envia push. Cada um tem limite. Como controlar?

**Solução - Integration Rate Limits:**
```yaml
integracoes_limites:
  gemini:
    rpm: 5        # 5 requisições por minuto por usuário
    diario: 50    # 50 por dia
    custo_token: 1000 # máx tokens por dia
  
  open_banking:
    diario: 2     # 2 sincronizações por dia (caro)
    timeout: 30s  # max duração da sync
  
  stripe:
    rpm: 10
    diario: 100
  
  email_marketing:
    rpm: 20
    diario: 1000
  
  push_notifications:
    hora: 100     # max 100 notificações por hora
    usuario: 5    # max 5 para mesmo usuário por dia

Implementação:
  - Table: integracoes_quotas (user_id, integracao, requisicoes_hoje, reset_em)
  - Middleware: verifica quota antes de chamar integração
  - Fase 0 ou 9: implementar
```

---

## 📋 Checklist Arquitetônico

### Fase 0 (Nova - Infraestrutura Base)

- [ ] **Setup Redis**
  - Configurar Redis cluster (prod) ou Redis simple (dev)
  - Cache key pattern: `grana360:{tipo}:{id}:{versao}`
  - TTL strategy documentado
  - Time estimate: 4h

- [ ] **Event Queue (Bull/RabbitMQ)**
  - Setup Bull (simples) ou RabbitMQ (escalável)
  - Criar workers para: analytics, notifications, webhooks
  - Dead letter queue para erros
  - Time estimate: 8h

- [ ] **Logging Centralizado**
  - Integrar Datadog ou Sentry
  - Logs estruturados (JSON)
  - Alertas por erro crítico
  - Time estimate: 6h

- [ ] **Database**
  - Criar índices iniciais
  - Setup replicação (se prod)
  - Backup automático
  - Time estimate: 4h

- [ ] **LGPD & Segurança**
  - Criar tabelas: consent_logs, audit_logs
  - Implementar: direito acesso, esquecimento, portabilidade
  - PRIVACY.md documentado
  - Time estimate: 8h

- [ ] **Rate Limiting Setup**
  - Token bucket com Redis
  - API gateway (nginx ou Cloudflare)
  - Time estimate: 4h

**Total Fase 0: 34h (~1 semana com 1 dev)**

---

### Fases 1-10 (Ajustes Menores)

- [ ] **Cada Fase: Seguir Data Pipeline**
  - Novos workers no event queue (se necessário)
  - Logging de ações críticas
  - Respeitando rate limits

- [ ] **Fase 6: IA Agent isolada**
  - Dedicar worker exclusivo (não bloqueia outras operações)
  - Cache agressivo (análise é determinística)

- [ ] **Fase 7: Integrações**
  - Cada integração tem seu retry strategy
  - Quotas documentadas

- [ ] **Fase 8: Analytics**
  - Setup BigQuery ETL pipeline (se volumes altos)
  - Ou: usar Postgres com índices otimizados (se volumes baixos-médios)
  - Recomendação: começar com Postgres, migrar para BigQuery se > 10M transações

- [ ] **Fase 9: Performance**
  - Benchmarks por módulo
  - Otimizações baseadas em dados (não suposições)

- [ ] **Fase 10: Deployment**
  - Failover automático (replicação)
  - Rollback strategy
  - RTO/RPO documentados

---

## 🎯 Recomendações Finais

### Prioritário (Semana 1)

1. ✅ Criar Fase 0 (Infrastructure)
2. ✅ Documentar LGPD/Segurança
3. ✅ Setup event queue (Bull ou RabbitMQ)
4. ✅ Definir data pipeline explicitamente
5. ✅ Setup logging centralizado

### Timeline Revisado

```
Fase 0 (Infrastructure)     [1 semana]   ← NOVO
Fases 1-5 (Paralelo)        [3 semanas]
Fases 7-8 (Paralelo)        [4 semanas]
Fase 5.5 (Integration Test) [3 dias]
Fase 6 (IA Agent)           [3 semanas]
Fase 9 (Performance)        [2 semanas]
Fase 10 (Deploy)            [2 semanas]

TOTAL: 15-17 semanas (era 12-14)
Custo: +1 semana de preparação economiza débitos técnicos depois
```

### Stack Recomendado (Confirmado)

```yaml
Frontend:
  - React 18+
  - Next.js (SSR onde necessário)
  - TailwindCSS + Shadcn (UI components)
  - Recharts (gráficos)

Backend:
  - Node.js 18+ / Express ou Fastify
  - Supabase (PostgreSQL gerenciado)
  - Bull (job queue)
  - Datadog/Sentry (monitoring)

Integrações:
  - Gemini API (IA)
  - Stripe (pagamentos)
  - Evolution API (WhatsApp)
  - Pluggy/Tink (Open Banking)
  - Brevo (email marketing)

Infrastructure:
  - Redis (cache + queue backend)
  - Cloudflare (CDN + rate limiting)
  - Docker + GitHub Actions (CI/CD)
  - Vercel (frontend) ou Railway/Fly.io (backend)

Stack ✅ APROVADO
```

---

## 📚 Documentos Associados

- [MISSING_FEATURES_SPEC.md](./MISSING_FEATURES_SPEC.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

---

**Assinado:** Senior Architect  
**Data:** 2026-04-24  
**Status:** ✅ Aprovado com Recomendações  
**Próximo:** Compartilhar com equipe, iniciar Fase 0
