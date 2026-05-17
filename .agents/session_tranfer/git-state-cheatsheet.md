# Git State Cheatsheet — Captura Completa de Sessão

## Snapshot Rápido (1 comando)

```bash
echo "BRANCH: $(git branch --show-current)" && \
echo "REMOTE: $(git remote get-url origin 2>/dev/null)" && \
echo "" && echo "--- STATUS ---" && git status --short && \
echo "" && echo "--- ÚLTIMOS COMMITS ---" && git log --oneline -7 && \
echo "" && echo "--- COMMITS NÃO ENVIADOS ---" && git log @{u}.. --oneline 2>/dev/null || echo "(sem upstream)" && \
echo "" && echo "--- STASHES ---" && git stash list && \
echo "" && echo "--- DIFF STATS ---" && git diff --stat HEAD
```

## Comandos Individuais

| Intenção | Comando |
|---|---|
| Branch atual | `git branch --show-current` |
| Arquivos modificados | `git status --short` |
| Diff completo | `git diff HEAD` |
| Diff apenas staged | `git diff --cached` |
| Commits não pusheados | `git log @{u}.. --oneline` |
| Últimos commits | `git log --oneline --graph -10` |
| Listar stashes | `git stash list` |
| Ver conteúdo de stash | `git stash show -p stash@{0}` |
| Conflitos em andamento | `git diff --name-only --diff-filter=U` |
| Tags locais não pusheadas | `git push --tags --dry-run` |
| Submodules com mudança | `git submodule status` |

## Restauração — Checklist

```bash
# 1. Sincronizar com remote
git fetch origin
git status  # verificar se há divergência

# 2. Verificar stashes do snapshot anterior
git stash list

# 3. Verificar commits pendentes de push
git log @{u}.. --oneline

# 4. Verificar se há conflitos
git diff --name-only --diff-filter=U
```
