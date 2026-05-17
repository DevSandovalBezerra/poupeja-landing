# Plano: Split Monorepo → Repos Separados + Docker Swarm

## Goal
Desmembrar o monorepo `grana360admin` em dois repositórios independentes com builds e containers separados, deployados via Docker Swarm em VPS.

---

## Decisão Arquitetural: Turborepo Monorepo (não dois repos)

**Recomendação:** Manter **um único repo com Turborepo** (pnpm workspaces) ao invés de dois repos completamente separados.

| Abordagem | Prós | Contras |
|-----------|------|---------|
| **Turborepo (recomendado)** | Shared code (types, auth, utils), builds independentes, CI unificado | Repo maior |
| Dois repos separados | Isolamento total | Duplicação de código, sync de tipos manual, dois CIs |

**Estrutura final:**
```
poupeja/
├── apps/
│   ├── landing/       # Vite + React — landing page pública
│   └── app/           # Vite + React — dashboard + admin
├── packages/
│   ├── ui/            # shadcn/ui components compartilhados
│   ├── types/         # TypeScript types compartilhados
│   ├── supabase/      # Supabase client + hooks compartilhados
│   └── utils/         # Funções utilitárias compartilhadas
├── turbo.json
├── pnpm-workspace.yaml
└── docker/
    ├── landing/       # Dockerfile + nginx.conf
    ├── app/           # Dockerfile + nginx.conf
    └── swarm-stack.yml
```

---

## Containers

| Container | Imagem | Porta | Conteúdo |
|-----------|--------|-------|----------|
| `poupeja-landing` | nginx:alpine | 80 | Build estático de `apps/landing` |
| `poupeja-app` | nginx:alpine | 80 | Build estático de `apps/app` |
| Supabase | externo | — | Permanece na cloud |

---

## Fases

### FASE 0 — Auditoria e Mapeamento (TDD: sem código ainda)
- [ ] **0.1** Mapear todos shared components entre landing e app
  - Verificar: `grep -r "import" src/pages/LandingPage.tsx` → lista de deps
- [ ] **0.2** Identificar shared code: types, utils, supabase client, hooks de auth
  - Verificar: `src/types/`, `src/utils/`, `src/integrations/supabase/`
- [ ] **0.3** Listar rotas de cada app
  - Landing: `/`, `/plans` (público)
  - App: `/dashboard`, `/login`, `/register`, `/admin`, todas as outras
- [ ] **0.4** Mapear variáveis `.env` por app (quais são exclusivas de cada um)
  - Verificar: landing precisa apenas de branding vars; app precisa de Supabase vars
- [ ] **0.5** Documentar ADR (Architecture Decision Record) em `docs/adr/001-monorepo-split.md`

---

### FASE 1 — Setup Turborepo
- [ ] **1.1** Instalar pnpm globalmente: `npm install -g pnpm`
  - Verificar: `pnpm --version`
- [ ] **1.2** Criar estrutura base do monorepo em novo diretório `poupeja/`
  ```bash
  mkdir -p poupeja/{apps/{landing,app},packages/{ui,types,supabase,utils},docker/{landing,app}}
  ```
- [ ] **1.3** Criar `poupeja/pnpm-workspace.yaml`
  ```yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```
  Verificar: `cat pnpm-workspace.yaml`
- [ ] **1.4** Criar `poupeja/turbo.json` com pipeline build/dev/test/lint
  Verificar: `npx turbo --version`
- [ ] **1.5** Criar `poupeja/package.json` root com scripts globais
  Verificar: `pnpm install` sem erros

---

### FASE 2 — Setup de Testes (TDD First — antes de mover código)

> **Regra TDD:** Escrever testes ANTES de extrair cada package/app.

- [ ] **2.1** Adicionar Vitest + Testing Library em cada app e package
  ```bash
  # Em cada app e package
  pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom
  ```
  Verificar: `pnpm test` retorna "no tests found" (ainda não há testes)
- [ ] **2.2** Configurar `vitest.config.ts` em cada workspace
  Verificar: `pnpm --filter @poupeja/ui test` executa sem erro de config
- [ ] **2.3** Adicionar Playwright para E2E
  ```bash
  pnpm add -D @playwright/test
  npx playwright install
  ```
  Verificar: `npx playwright --version`
- [ ] **2.4** Escrever testes unitários para `packages/utils` ANTES de criar o package
  - `formatCurrency.test.ts` → testa formatação de moeda BR
  - `dateUtils.test.ts` → testa helpers de data
  - Verificar: `pnpm test` → testes FALHAM (red phase TDD)
- [ ] **2.5** Escrever testes de componentes para `packages/ui` ANTES de extrair
  - `Button.test.tsx` → renderiza, responde a click
  - `Card.test.tsx` → renderiza conteúdo
  - Verificar: testes FALHAM (ainda sem implementação)
- [ ] **2.6** Escrever testes E2E críticos ANTES de mover rotas
  - `landing.spec.ts` → landing page carrega, CTA clicável, link login funciona
  - `auth.spec.ts` → login com credenciais válidas → redirect para /dashboard
  - `admin.spec.ts` → acesso /admin sem role → "Acesso Negado"
  - Verificar: testes FALHAM (apps ainda não existem)

---

### FASE 3 — Criar packages compartilhados (TDD: green phase)

- [ ] **3.1** Criar `packages/types/` — migrar types de `src/types/`
  - Verificar: testes de types passam → `pnpm --filter @poupeja/types test`
- [ ] **3.2** Criar `packages/utils/` — migrar `src/utils/`, `src/lib/`
  - Verificar: testes unitários de utils PASSAM (green)
- [ ] **3.3** Criar `packages/supabase/` — migrar `src/integrations/supabase/`
  - Inclui: client, types gerados, hooks de auth
  - Verificar: `import { supabase } from '@poupeja/supabase'` resolve
- [ ] **3.4** Criar `packages/ui/` — migrar shadcn/ui components compartilhados
  - Verificar: testes de componentes PASSAM (green)
- [ ] **3.5** Refactor: todos os packages exportam via `index.ts` limpo
  - Verificar: `pnpm build` em todos packages sem erro

---

### FASE 4 — Criar `apps/landing`

- [ ] **4.1** Inicializar app Vite em `apps/landing/`
  ```bash
  pnpm create vite apps/landing --template react-ts
  ```
  Verificar: `pnpm --filter @poupeja/landing dev` abre porta 5173
- [ ] **4.2** Mover `src/pages/LandingPage.tsx` + componentes exclusivos para `apps/landing/src/`
  - Verificar: landing renderiza sem imports quebrados
- [ ] **4.3** Configurar `.env` mínimo para landing (só branding vars, sem Supabase auth)
  - Verificar: página carrega sem erros no console
- [ ] **4.4** Adicionar dependências `@poupeja/ui`, `@poupeja/types` via workspace
  ```bash
  pnpm --filter @poupeja/landing add @poupeja/ui@workspace:*
  ```
  Verificar: imports resolvem
- [ ] **4.5** Testes E2E `landing.spec.ts` PASSAM (green)
  ```bash
  npx playwright test landing
  ```
- [ ] **4.6** Build de produção funciona
  ```bash
  pnpm --filter @poupeja/landing build
  ```
  Verificar: `dist/` gerado, sem erros TypeScript

---

### FASE 5 — Criar `apps/app`

- [ ] **5.1** Inicializar app Vite em `apps/app/`
  Verificar: `pnpm --filter @poupeja/app dev` abre sem conflito de porta
- [ ] **5.2** Mover todas as rotas de `src/` (exceto landing) para `apps/app/src/`
  - Dashboard, Admin, Login, Register, todas as pages
  - Verificar: `App.tsx` sem rotas de landing
- [ ] **5.3** Adicionar dependências `@poupeja/ui`, `@poupeja/types`, `@poupeja/supabase`
  Verificar: imports resolvem, `supabase.auth.getUser()` funciona
- [ ] **5.4** Configurar `.env` completo (Supabase URL, ANON_KEY, etc.)
  Verificar: login `admin@admin.com` funciona em dev
- [ ] **5.5** Testes E2E `auth.spec.ts` e `admin.spec.ts` PASSAM (green)
  ```bash
  npx playwright test auth admin
  ```
- [ ] **5.6** Build de produção funciona
  ```bash
  pnpm --filter @poupeja/app build
  ```
  Verificar: bundle < 1.5MB gzipped (atual é 563KB)

---

### FASE 6 — Docker: Containers nginx

- [ ] **6.1** Criar `docker/landing/nginx.conf` com SPA fallback
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```
  Verificar: `nginx -t` passa
- [ ] **6.2** Criar `docker/landing/Dockerfile` multi-stage
  ```dockerfile
  # Stage 1: build
  FROM node:20-alpine AS builder
  # ... build da landing

  # Stage 2: serve
  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  ```
  Verificar: `docker build -t poupeja-landing docker/landing/` sem erro
- [ ] **6.3** Criar `docker/app/Dockerfile` e `nginx.conf` (mesma estrutura)
  Verificar: `docker build -t poupeja-app docker/app/` sem erro
- [ ] **6.4** Testar containers localmente
  ```bash
  docker run -p 3001:80 poupeja-landing
  docker run -p 3002:80 poupeja-app
  ```
  Verificar: `curl localhost:3001` → landing OK; `curl localhost:3002` → app OK
- [ ] **6.5** Testar SPA routing nos containers
  Verificar: `curl localhost:3002/admin` → retorna `index.html` (não 404)

---

### FASE 7 — Docker Swarm Stack

- [ ] **7.1** Criar `docker/swarm-stack.yml`
  ```yaml
  version: '3.8'
  services:
    landing:
      image: registry/poupeja-landing:latest
      deploy:
        replicas: 2
        update_config:
          parallelism: 1
          delay: 10s
        restart_policy:
          condition: on-failure
      networks:
        - poupeja-net

    app:
      image: registry/poupeja-app:latest
      deploy:
        replicas: 2
        update_config:
          parallelism: 1
          delay: 10s
      networks:
        - poupeja-net

    traefik:
      image: traefik:v3
      # ... proxy reverso + SSL
      networks:
        - poupeja-net

  networks:
    poupeja-net:
      driver: overlay
  ```
  Verificar: `docker stack deploy --compose-file docker/swarm-stack.yml poupeja --dry-run`
- [ ] **7.2** Configurar Traefik como reverse proxy + SSL (Let's Encrypt)
  - landing → `poupeja.com.br` (ou domínio da landing)
  - app → `app.poupeja.com.br`
  Verificar: labels Traefik corretas no stack file
- [ ] **7.3** Configurar secrets do Swarm para variáveis sensíveis
  ```bash
  echo "eyJhbGci..." | docker secret create supabase_anon_key -
  ```
  Verificar: `docker secret ls` mostra secrets criados

---

### FASE 8 — CI/CD (GitHub Actions)

- [ ] **8.1** Criar `.github/workflows/landing.yml`
  - Trigger: push em `apps/landing/**`
  - Steps: test → build → docker build → push registry → deploy swarm
  Verificar: workflow válido via `act` ou push em branch de teste
- [ ] **8.2** Criar `.github/workflows/app.yml`
  - Trigger: push em `apps/app/**` ou `packages/**`
  - Steps: test → build → docker build → push registry → deploy swarm
  Verificar: workflow válido
- [ ] **8.3** Configurar GitHub Secrets: `DOCKER_REGISTRY`, `VPS_SSH_KEY`, `SUPABASE_*`
  Verificar: secrets visíveis em Settings → Secrets

---

### FASE 9 — Deploy VPS

- [ ] **9.1** Inicializar Docker Swarm na VPS
  ```bash
  ssh user@vps "docker swarm init"
  ```
  Verificar: `docker node ls` mostra 1 manager
- [ ] **9.2** Push das imagens para registry
  ```bash
  docker push registry/poupeja-landing:latest
  docker push registry/poupeja-app:latest
  ```
  Verificar: imagens visíveis no registry
- [ ] **9.3** Deploy do stack
  ```bash
  docker stack deploy --compose-file docker/swarm-stack.yml poupeja
  ```
  Verificar: `docker stack ps poupeja` → todos services Running
- [ ] **9.4** Verificar health endpoints
  - `curl https://poupeja.com.br` → landing OK
  - `curl https://app.poupeja.com.br/login` → app OK
  - `curl https://app.poupeja.com.br/admin` → redirect para /login
- [ ] **9.5** Testar rolling update (zero downtime)
  ```bash
  docker service update --image registry/poupeja-app:v2 poupeja_app
  ```
  Verificar: serviço atualiza sem downtime (replicas = 2)

---

### FASE 10 — Verificação Final

- [ ] Todos testes unitários passam: `pnpm test`
- [ ] Todos testes E2E passam em staging: `npx playwright test`
- [ ] Build completo sem erros: `pnpm build`
- [ ] Landing acessível no domínio público
- [ ] App acessível, login funciona, admin restrito por role
- [ ] Rolling update testado e funcional
- [ ] Rollback testado: `docker service rollback poupeja_app`
- [ ] Monitoramento configurado (logs via `docker service logs`)

---

## Done When
- [ ] Landing page deploy independente sem afetar o app
- [ ] App deploy independente sem afetar a landing
- [ ] Zero downtime em updates (Docker Swarm rolling)
- [ ] Todos testes E2E críticos passando em produção
- [ ] SSL funcionando em ambos domínios

---

## Skills Aplicadas
- `architecture` → ADR + trade-off analysis
- `testing-patterns` → Testing pyramid, AAA pattern
- `deployment-procedures` → 5-phase deploy, rollback strategy
- `nextjs-react-expert` → Bundle optimization, dynamic imports
- `app-builder/monorepo-turborepo` → Estrutura de workspaces

## Estimativa
| Fase | Tempo |
|------|-------|
| 0-1: Auditoria + Turborepo | 4h |
| 2: Setup testes (TDD) | 3h |
| 3: Packages compartilhados | 4h |
| 4-5: Apps landing + app | 6h |
| 6-7: Docker + Swarm | 4h |
| 8-9: CI/CD + VPS deploy | 3h |
| 10: Verificação final | 1h |
| **Total** | **~25h** |
