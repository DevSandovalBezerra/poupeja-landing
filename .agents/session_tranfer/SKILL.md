---
name: session-transfer
description: >
  Use esta skill para capturar, serializar e restaurar o contexto completo de uma sessão de desenvolvimento em IDEs (VS Code, JetBrains, Cursor, Neovim, etc.). Deve ser acionada sempre que o desenvolvedor precisar: pausar e continuar depois, passar a sessão para outro dev, trocar de máquina, retomar após interrupção longa, ou fazer handoff de tarefa em equipe. Gatilhos incluem: "transferir sessão", "salvar contexto", "continuar de onde parei", "handoff de tarefa", "resumo da sessão atual", "snapshot do estado", "passar para outro dev", "retomar sessão", "o que eu estava fazendo", "continuar trabalho".
category: development
risk: safe
source: community
tags: "[session, context, handoff, ide, developer-experience, productivity]"
date_added: "2026-05-11"
---

# session-transfer

## Propósito

Capturar todos os pontos relevantes de uma sessão de desenvolvimento ativa e gerar um documento estruturado de transferência que permita a qualquer dev (ou à mesma pessoa depois) retomar o trabalho exatamente de onde parou — com zero perda de contexto.

---

## Quando Usar Esta Skill

- Pausar o trabalho e continuar em outra sessão ou máquina
- Fazer **handoff** de tarefa entre membros do time
- Gerar resumo de fim de expediente (EOD - End of Day)
- Trocar de branch ou contexto temporariamente e querer voltar
- Documentar progresso antes de uma reunião ou interrupção longa
- Integrar com ferramentas de ticket (Jira, Linear, GitHub Issues)

---

## Os 10 Pontos Críticos de uma Sessão

Todo documento de transferência deve cobrir estes pontos, nesta ordem de prioridade:

### 1. 🎯 Objetivo da Sessão
O que estava sendo feito. A tarefa ou história de usuário em andamento.

```
- Ticket/Issue: [#ID ou URL]
- Objetivo principal: [em 1-2 frases]
- Critério de conclusão (DoD): [o que significa "pronto"]
```

### 2. 🌿 Estado do Repositório Git
O snapshot exato do código.

```bash
# Executar para capturar estado atual:
git status
git log --oneline -10
git stash list
git diff --stat HEAD
```

Capturar:
- **Branch ativa** e seu upstream
- **Commits não enviados** (unpushed commits)
- **Arquivos modificados** (staged e unstaged)
- **Stashes existentes** e seu conteúdo descritivo
- **Conflitos de merge** em andamento, se houver

### 3. 📂 Arquivos em Foco
Quais arquivos eram o centro de atenção durante a sessão.

```
- Arquivo principal sendo editado: [path]
- Arquivos auxiliares abertos: [lista]
- Linha/função específica relevante: [ex: src/auth/login.ts:142 - função validateToken()]
- Arquivos com TODO/FIXME adicionados nesta sessão: [lista]
```

### 4. 🐛 Estado de Debug / Erros em Investigação
O contexto de qualquer problema sendo investigado.

```
- Erro/bug em análise: [descrição]
- Stack trace relevante: [trecho ou caminho do log]
- Hipóteses levantadas: [o que se acha que é a causa]
- Abordagens já testadas e descartadas: [lista]
- Ferramentas de debug em uso: [breakpoints, logs, profiler]
```

### 5. ✅ Testes
Estado atual da suíte de testes.

```bash
# Executar para verificar estado:
npm test -- --passWithNoTests 2>&1 | tail -20
# ou: pytest -q 2>&1 | tail -20
# ou: go test ./... 2>&1 | tail -20
```

Capturar:
- **Testes falhando** (nome + motivo se conhecido)
- **Testes novos** adicionados nesta sessão (ainda não passando ou passando)
- **Cobertura** em áreas tocadas
- **Testes ignorados** (skipped) intencionalmente com motivo

### 6. 🏗️ Decisões de Arquitetura / Design
Decisões técnicas tomadas durante a sessão que precisam ser lembradas.

```
- Decisão: [o que foi decidido]
  Motivo: [por que]
  Alternativas rejeitadas: [o que foi considerado e descartado]
  
- Ex: "Optou-se por JWT stateless em vez de sessão no Redis
       porque o serviço precisa escalar horizontalmente.
       Redis foi descartado por adicionar dependência de infra."
```

### 7. 🔧 Ambiente de Desenvolvimento
O estado do ambiente para que a sessão seja reproduzível.

```bash
# Capturar versões relevantes:
node --version && npm --version   # ou python --version, go version, etc.
docker ps --format "table {{.Names}}\t{{.Ports}}"  # containers rodando
cat .env.local 2>/dev/null | grep -v "SECRET\|KEY\|PASSWORD"  # env vars não-sensíveis
lsof -i | grep LISTEN | awk '{print $9}' | sort -u  # portas em uso
```

Capturar:
- **Serviços rodando** (banco, cache, mocks, APIs locais)
- **Portas em uso** e para qual serviço
- **Variáveis de ambiente especiais** (sem dados sensíveis)
- **Versões de tools** relevantes para o contexto

### 8. 📋 Próximos Passos (Next Steps)
Lista ordenada do que fazer a seguir, do mais para o menos urgente.

```
[ ] 1. [Próximo passo imediato — o que fazer nos primeiros 5 min]
[ ] 2. [Segunda ação]
[ ] 3. [Terceira ação]
...
[ ] N. [Backlog desta tarefa]
```

Ser específico: não "corrigir bug", mas "corrigir função `parseDate()` em `utils/date.ts:87` que não trata timezone UTC-5".

### 9. 🚧 Blockers / Dependências Externas
O que está impedindo ou pode impedir o progresso.

```
- Blocker: [descrição]
  Tipo: [técnico | aguardando review | aguardando resposta | dependência externa]
  Owner: [quem pode desbloquear]
  
- Ex: "API de pagamento retorna 429 em staging.
       Aguardando cota ser aumentada pelo time de infra.
       Owner: @joao.silva"
```

### 10. 🔗 Referências e Links Úteis
Contexto externo que estava sendo consultado.

```
- Documentação relevante: [URLs]
- PRs/Issues relacionados: [URLs]
- Comentários de code review pendentes: [URLs]
- Conversa de Slack/Teams com contexto: [link ou resumo]
- Artigos/StackOverflow consultados: [URLs dos mais relevantes]
```

---

## Workflow de Execução

### Passo 1 — Coletar dados automaticamente

Executar os seguintes comandos para construir o snapshot:

```bash
echo "=== GIT STATE ===" && \
git branch --show-current && \
git status --short && \
git log --oneline -5 && \
git stash list && \
echo "=== RECENT CHANGES ===" && \
git diff --stat HEAD && \
echo "=== TODOS ADDED ===" && \
git diff HEAD | grep "^+" | grep -i "TODO\|FIXME\|HACK\|XXX" | head -20
```

### Passo 2 — Gerar documento de transferência

Com os dados coletados, gerar um arquivo `SESSION_TRANSFER.md` na raiz do projeto:

```markdown
# 🔄 Session Transfer — [DATA] [HORA]

**De:** [nome do dev / máquina]  
**Para:** [nome ou "próxima sessão"]  
**Branch:** `[branch-name]`  
**Ticket:** [#ID]  
**Tempo estimado para retomar:** ~[X] minutos

---

## 🎯 Objetivo
[Texto]

## 🌿 Git State
[Output do git status/log]

## 📂 Arquivos em Foco
[Lista]

## 🐛 Debug / Erros
[Estado]

## ✅ Testes
[Estado]

## 🏗️ Decisões Tomadas
[Lista]

## 🔧 Ambiente
[Estado]

## 📋 Próximos Passos
[ ] 1. ...
[ ] 2. ...

## 🚧 Blockers
[Lista]

## 🔗 Referências
[Links]

---
*Gerado por session-transfer skill em [timestamp]*
```

### Passo 3 — Validação do documento

Verificar que o documento gerado cobre os pontos críticos:

```
✅ Objetivo claramente definido?
✅ Branch e estado do git documentados?
✅ Próximo passo imediato é específico e acionável?
✅ Qualquer erro/bug em investigação tem contexto suficiente?
✅ Nenhum dado sensível (senhas, tokens) incluído?
✅ Estimativa de tempo para retomar incluída?
```

---

## Formatos de Saída

### Modo: Handoff para outro dev
Gerar documento completo com todos os 10 pontos. Incluir contexto de "por que" das decisões, não apenas "o quê".

### Modo: EOD (End of Day)
Gerar versão compacta focada em: Objetivo, Git State, Próximos Passos, Blockers.

### Modo: Snapshot rápido (< 2 min)
Gerar apenas: Branch, arquivos em foco, próximo passo imediato.

### Modo: Restauração
Ao receber um `SESSION_TRANSFER.md`, ler e gerar checklist de retomada:
1. Verificar branch e sincronizar com remote
2. Instalar/verificar dependências se ambiente mudou
3. Subir serviços listados no ambiente
4. Ler próximos passos e confirmar qual executar primeiro

---

## Integrações com IDEs

### VS Code
- Salvar lista de arquivos abertos: usar workspace `.code-workspace`
- Exportar extensões em uso: `code --list-extensions > extensions.txt`
- Incluir configurações de debug (`.vscode/launch.json`) no contexto

### JetBrains (IntelliJ, WebStorm, GoLand, etc.)
- Shelf de mudanças = equivalente ao `git stash` na IDE
- TODO Tool Window: listar TODOs adicionados na sessão
- Run Configurations: documentar qual configuração estava em uso

### Cursor / Windsurf
- Incluir o histórico de prompts relevantes da sessão de AI
- Documentar regras de `.cursorrules` / `.windsurfrules` ativas

### Neovim / Vim
- Salvar sessão: `:mksession session.vim`
- Incluir marks relevantes e registros utilizados

---

## Boas Práticas

**Seja específico nos próximos passos.** "Corrigir bug" é inútil. "Investigar por que `UserService.findById()` retorna null quando userId contém hífen (ex: `user-123`), reproduzível em `tests/user.test.ts:45`" é acionável.

**Documente os "por quês", não só os "o quês".** A decisão técnica sem o raciocínio que a gerou perde 80% do seu valor.

**Nunca inclua segredos.** Nenhuma senha, API key, token ou credencial no documento de transferência. Use referências como `[ver .env.local]` ou `[ver 1Password: entry X]`.

**Estime o tempo de retomada.** Ajuda a priorizar e gerenciar expectativas.

**Gere o documento ANTES de fechar a IDE,** não depois — o contexto se perde rapidamente.

---

## Referências

- `references/ide-integrations.md` — Comandos específicos por IDE para exportar estado
- `references/git-state-cheatsheet.md` — Comandos git para captura de estado completo
- `references/templates/` — Templates de SESSION_TRANSFER.md para diferentes contextos (solo dev, pair programming, handoff de squad)
