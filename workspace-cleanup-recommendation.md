# Grana360 Admin - Workspace Cleanup Recommendation

**Data:** 2026-04-25  
**Status:** 📋 Pronto para Revisão e Movimentação  
**Nota:** Você se encarrega da movimentação para pasta `arquivo_morto/`

---

## 📊 Análise Atual do Workspace

### Tamanho das Pastas Principais
```
node_modules/          ~500 MB  (gerado, ignorado no git ✓)
backend/node_modules/  ~200 MB  (gerado, ignorado no git ✓)
.git/                  ~100 MB  (versionamento)
dist/                  ~50 MB   (gerado, ignorado no git ✓)
dev-dist/              ~30 MB   (gerado, ignorado no git ✓)
src/                   ~5 MB    (código fonte - KEEP)
docs/                  ~2 MB    (documentação - KEEP)
admin360images/        ~20 MB   (imagens - revisar uso)
```

### Arquivos na Raiz
- ✅ `package.json`, `tsconfig.json`, `vite.config.ts` - **KEEP**
- ✅ `vercel.json`, `docker-compose.yml`, `Dockerfile` - **KEEP**
- ❌ `fix-encoding.ps1` - **MOVER** (script temporário)
- ❌ `SECURITY_AUDIT_LOG_REMOVAL.md` - **MOVER** (documentação antiga)
- ✅ `README.md` - **KEEP**

---

## 🗑️ CATEGORIA 1: PASTAS/ARQUIVOS A MOVER PARA `arquivo_morto/`

### 1.1 - Diretórios Antigos/Irrelevantes
```
Fluxos n8n Poupe Ja com MCP v2/
  Tamanho: ~15 MB
  Razão: Versão antiga de workflows n8n, não é parte do código ativo
  Ação: MOVER para arquivo_morto/fluxos-n8n-obsoleto/
  Impacto no git: Reduz poluição

backend/
  Tamanho: ~250 MB (principalmente node_modules)
  Descrição: Backend antigo (segundo repositório?)
  Ação: MOVER para arquivo_morto/backend-obsoleto/
  Nota: Verificar se ainda está em uso
  Impacto: -250 MB do workspace
```

### 1.2 - Pastas de Build Geradas (já ignoradas, mas desnecessárias)
```
dist/
  Tamanho: ~50 MB
  Razão: Build output, re-gerada com 'npm run build'
  Ação: Pode DELETE (ou mover se quiser backup)
  Impacto: -50 MB, git ignore já ativo

dev-dist/
  Tamanho: ~30 MB
  Razão: Desenvolvimento build, também gerado
  Ação: Pode DELETE (ou mover)
  Impacto: -30 MB

node_modules/ (raiz)
  Tamanho: ~500 MB
  Razão: Gerado com 'npm install'
  Ação: Já deve estar em .gitignore (KEEP, mas ignorado)
  Impacto: Não afeta git se ignorado
```

### 1.3 - Documentação Desatualizada
```
SECURITY_AUDIT_LOG_REMOVAL.md
  Razão: Documentação de fix específica, não relevante para roadmap
  Ação: MOVER para arquivo_morto/documentacao-antiga/

docs/GUIA_CURSOR_IA_IMPLEMENTACAO.md
  Tamanho: ~36 KB
  Razão: Guia de implementação com IA (obsoleto com novos planos)
  Ação: MOVER para arquivo_morto/documentacao-antiga/
  Nota: Substituído por docs/IMPLEMENTATION_PLAN.md (novo)

docs/gerador-html-estatico.md
  Razão: Documentação técnica descontinuada
  Ação: MOVER para arquivo_morto/documentacao-antiga/

docs/Correções de Bugs com IA/ (pasta)
  Razão: Folder de bug fixes antigos
  Ação: MOVER para arquivo_morto/
  Impacto: Limpa a pasta docs
```

### 1.4 - Arquivos Auxiliares/Scripts Temporários
```
fix-encoding.ps1
  Razão: Script PowerShell temporário para encoding
  Ação: MOVER para arquivo_morto/scripts-temporarios/
  Impacto: Não afeta código

bun.lockb
  Tamanho: ~100 KB
  Razão: Lock file do Bun (npm é o package manager principal)
  Ação: DELETE ou MOVER (redundante com package-lock.json)
  Impacto: Limpa git tracking desnecessário
```

### 1.5 - Pasta de Imagens (Validar Uso)
```
admin360images/
  Tamanho: ~20 MB
  Conteúdo: 17 screenshots do sistema (tela1.png - tela17.png)
  Status: Usada na análise de features (pode arquivar depois)
  Ação: MOVER para arquivo_morto/imagens-screenshots-v1/
  Nota: Manter enquanto estiver referenciada nos docs
  Timeline: Mover após Fase 1 (quando screenshots estão fully documentadas)
```

---

## ✅ CATEGORIA 2: ARQUIVOS/PASTAS A MANTER NO WORKSPACE

### Código Fonte
```
✅ src/
   - Código React/TypeScript principal
   - KEEP sempre
   - Tamanho: ~5 MB

✅ package.json, package-lock.json
   - Dependências do projeto
   - KEEP sempre

✅ tsconfig.json, vite.config.ts
   - Configuração de build
   - KEEP sempre
```

### Configuração e Deploy
```
✅ vercel.json
   - Deploy config Vercel
   - KEEP

✅ docker-compose.yml, Dockerfile
   - Container setup
   - KEEP

✅ eslint.config.js, postcss.config.js, tailwind.config.ts
   - Build tools config
   - KEEP

✅ .github/workflows/
   - CI/CD pipelines
   - KEEP

✅ .env (com valores reais)
   - Variáveis de ambiente (gitignored)
   - KEEP mas ensure está em .gitignore
```

### Documentação Nova (Manter)
```
✅ docs/README.md
   - Índice dos docs (NOVO)
   - KEEP

✅ docs/MISSING_FEATURES_SPEC.md
   - Especificação de features (NOVO)
   - KEEP

✅ docs/IMPLEMENTATION_PLAN.md
   - Plano de implementação (NOVO - 52 KB)
   - KEEP

✅ docs/ARCHITECTURE_REVIEW.md
   - Revisão arquitetônica (NOVO)
   - KEEP

✅ docs/DESIGN_SYSTEM_SPEC.md
   - Design system (NOVO - 38 KB)
   - KEEP

✅ docs/EXECUTIVE_SUMMARY.md
   - Sumário executivo (NOVO)
   - KEEP

✅ docs/deployment/
   - Deployment guides
   - KEEP

✅ docs/installation/
   - Installation guides
   - KEEP
```

### Infraestrutura
```
✅ supabase/
   - Supabase configuration
   - KEEP

✅ public/
   - Static assets
   - KEEP

✅ .git/, .github/
   - Version control
   - KEEP

✅ .gitignore
   - Git ignore rules
   - KEEP (verify coverage)
```

---

## 🚀 ESTRUTURA PROPOSTA APÓS LIMPEZA

```
grana360admin/ (workspace)
├── .github/
│   └── workflows/              ✅ KEEP
├── .claude/                    ✅ KEEP (settings)
├── docs/
│   ├── README.md               ✅ KEEP (NEW)
│   ├── MISSING_FEATURES_SPEC.md ✅ KEEP (NEW)
│   ├── IMPLEMENTATION_PLAN.md  ✅ KEEP (NEW)
│   ├── ARCHITECTURE_REVIEW.md  ✅ KEEP (NEW)
│   ├── DESIGN_SYSTEM_SPEC.md   ✅ KEEP (NEW)
│   ├── EXECUTIVE_SUMMARY.md    ✅ KEEP (NEW)
│   ├── deployment/             ✅ KEEP
│   ├── installation/           ✅ KEEP
│   └── [OLD DOCS MOVED]        ❌ MOVED to arquivo_morto/
├── public/                     ✅ KEEP
├── src/                        ✅ KEEP (main code)
├── supabase/                   ✅ KEEP
├── node_modules/               ✅ KEEP (but .gitignore)
├── [BUILD FOLDERS]             ⚠️  DELETE or MOVE (optional)
├── package.json                ✅ KEEP
├── vite.config.ts              ✅ KEEP
├── vercel.json                 ✅ KEEP
├── docker-compose.yml          ✅ KEEP
├── .env                        ✅ KEEP (.gitignored)
├── .gitignore                  ✅ KEEP (verify)
└── [SCRIPTS/TEMP FILES MOVED]  ❌ MOVED to arquivo_morto/

arquivo_morto/ (NEW - outside git, for archival)
├── fluxos-n8n-obsoleto/
├── backend-obsoleto/
├── documentacao-antiga/
├── scripts-temporarios/
├── imagens-screenshots-v1/
└── README.md (lista de arquivos movidos)
```

---

## 📋 PLANO DE AÇÃO (DETALHADO)

### FASE 1: CRIAR ESTRUTURA
```bash
# Você irá criar (ou usar existing):
mkdir arquivo_morto/
mkdir arquivo_morto/documentacao-antiga/
mkdir arquivo_morto/scripts-temporarios/
mkdir arquivo_morto/fluxos-n8n-obsoleto/
mkdir arquivo_morto/backend-obsoleto/
mkdir arquivo_morto/imagens-screenshots-v1/
```

### FASE 2: MOVER ARQUIVOS ANTIGOS
```
Mover (com caminho relativo):
  Fluxos n8n Poupe Ja com MCP v2/            → arquivo_morto/fluxos-n8n-obsoleto/
  backend/                                    → arquivo_morto/backend-obsoleto/
  docs/GUIA_CURSOR_IA_IMPLEMENTACAO.md       → arquivo_morto/documentacao-antiga/
  docs/gerador-html-estatico.md              → arquivo_morto/documentacao-antiga/
  docs/Correções de Bugs com IA/             → arquivo_morto/documentacao-antiga/
  SECURITY_AUDIT_LOG_REMOVAL.md              → arquivo_morto/documentacao-antiga/
  fix-encoding.ps1                            → arquivo_morto/scripts-temporarios/
  admin360images/                             → arquivo_morto/imagens-screenshots-v1/
```

### FASE 3: DELETAR BUILD ARTIFACTS (OPCIONAL)
```
Você pode DELETE ou MOVER (mover é mais seguro):
  dist/                   → DELETE (ou mover)
  dev-dist/               → DELETE (ou mover)
  bun.lockb               → DELETE (redundante)
  
Deixar IGNORADO (não se preocupar):
  node_modules/           (já em .gitignore)
  backend/node_modules/   (já em .gitignore se backend fora do versionamento)
```

### FASE 4: VERIFICAR .gitignore
```
Garantir que está ignorando:
  node_modules/
  dist/
  dev-dist/
  .env (mantém .env.example)
  .next/
  build/
  *.swp
  .DS_Store
```

---

## 📊 RESUMO DE IMPACTO

| Item | Tamanho | Ação | Impacto Git |
|------|---------|------|------------|
| backend/ | ~250 MB | MOVER | -250 MB |
| dist/ | ~50 MB | DELETE | -50 MB |
| dev-dist/ | ~30 MB | DELETE | -30 MB |
| Fluxos n8n/ | ~15 MB | MOVER | -15 MB |
| admin360images/ | ~20 MB | MOVER | -20 MB |
| docs/ antigos | ~5 MB | MOVER | -5 MB |
| fix-encoding.ps1 | ~10 KB | MOVER | -10 KB |
| bun.lockb | ~100 KB | DELETE | -100 KB |
| **TOTAL REDUÇÃO** | **~365 MB** | - | **-365 MB** |

**node_modules não afeta git (já ignorado)**

---

## ✅ CHECKLIST DE LIMPEZA

### Antes de Começar
- [ ] Backup do workspace (recomendado)
- [ ] Criar pasta `arquivo_morto/`
- [ ] Revisar este documento com o time

### Movimentação
- [ ] Mover `Fluxos n8n Poupe Ja com MCP v2/` → `arquivo_morto/fluxos-n8n-obsoleto/`
- [ ] Mover `backend/` → `arquivo_morto/backend-obsoleto/`
- [ ] Mover `docs/GUIA_CURSOR_IA_...` → `arquivo_morto/documentacao-antiga/`
- [ ] Mover `docs/gerador-html-estatico.md` → `arquivo_morto/documentacao-antiga/`
- [ ] Mover `docs/Correções de Bugs com IA/` → `arquivo_morto/documentacao-antiga/`
- [ ] Mover `SECURITY_AUDIT_LOG_REMOVAL.md` → `arquivo_morto/documentacao-antiga/`
- [ ] Mover `fix-encoding.ps1` → `arquivo_morto/scripts-temporarios/`
- [ ] Mover `admin360images/` → `arquivo_morto/imagens-screenshots-v1/`

### Limpeza de Build
- [ ] DELETE `dist/` (ou mover)
- [ ] DELETE `dev-dist/` (ou mover)
- [ ] DELETE `bun.lockb`

### Validação Final
- [ ] Verificar `.gitignore` covers `node_modules/`
- [ ] Confirmar `src/` intacto
- [ ] Confirmar `docs/` limpo (apenas arquivos relevantes)
- [ ] Executar `npm install` para confirmar dependencies OK
- [ ] Executar `npm run build` para confirmar build OK
- [ ] Git status mostra menos arquivos tracked
- [ ] Criar `.gitignore` entry para `arquivo_morto/` se necessário

---

## 📝 CRIANDO ARQUIVO_MORTO/README.md (RECOMENDADO)

Após mover, crie um README na pasta arquivo_morto:

```markdown
# Arquivo Morto - Grana360 Admin

Essa pasta contém arquivos e diretórios antigos/obsoletos removidos do workspace ativo.

## Conteúdo

- **backend-obsoleto/** - Código backend antigo (substituído por API moderna)
- **fluxos-n8n-obsoleto/** - Workflows n8n desatualizados
- **documentacao-antiga/** - Documentos e guias obsoletos
- **scripts-temporarios/** - Scripts auxiliares antigos
- **imagens-screenshots-v1/** - Screenshots do sistema v1 (arquivo)

## Por que está aqui?

Esses arquivos foram movidos para limpeza do workspace:
1. Reduzir poluição do repositório
2. Manter histórico sem ocupar espaço ativo
3. Fácil recuperação se necessário

## Como recuperar?

Se necessário, mover arquivo específico de volta para workspace principal.

---
Data da Limpeza: 2026-04-25
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Revisar** esta recomendação
2. **Validar** que nenhum arquivo crítico será perdido
3. **Executar** a movimentação (você se encarrega)
4. **Testar** que projeto ainda funciona:
   ```bash
   npm install      # Confirma dependências
   npm run build    # Confirma build
   npm run dev      # Confirma desenvolvimento
   ```
5. **Commit** limpeza ao git com mensagem clara:
   ```
   chore: cleanup workspace - mover arquivos obsoletos para arquivo_morto/
   
   - Move backend obsoleto
   - Move fluxos n8n antigos
   - Move documentação desatualizada
   - Delete build artifacts
   - Reduz tamanho do workspace em ~365 MB
   ```

---

## ⚠️ AVISOS IMPORTANTES

- ✅ **SEGURO:** Todos os arquivos a mover estão FORA do src/
- ✅ **SEGURO:** Documentação nova foi criada (não será perdida)
- ✅ **SEGURO:** .gitignore já protege node_modules
- ⚠️ **ATENÇÃO:** Verificar se `backend/` realmente está obsoleto (consultar time)
- ⚠️ **ATENÇÃO:** Confirmar que não há referências ao `admin360images/` em código antes de mover

---

**Status:** 📋 Recomendação Pronta para Execução  
**Próximo Passo:** Você move os arquivos para `arquivo_morto/`
