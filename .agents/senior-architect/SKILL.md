---
name: "senior-architect"
description: "Define arquitetura, integrações e padrões (RAG, memória, Telegram, multi-tenant). Invoke quando decidir componentes, contratos, storage, segurança e evolução do Miro para Etelmir."
---

# Senior Architect

## Objetivo

Desenhar uma arquitetura simples, segura e barata para evoluir o Miro no Etelmir, mantendo a mesma stack (PHP + HTML/JS) e permitindo crescer com RAG, memória e Telegram.

## Quando invocar

- Planejamento de módulos, APIs, contratos e separação de responsabilidades.
- Decisões de armazenamento (SQLite vs MySQL), schema e migração.
- Estratégia de RAG (ingestão, chunking, embeddings, busca, citações).
- Integração com Telegram (webhook/polling, id_user:id_thread, upload).
- Segurança (chaves, uploads, validação, rate limit, auditoria).

## Regras de design (barato e evolutivo)

- “Thin UI, smart server”: front simples, backend com orquestração.
- Contratos explícitos: endpoints pequenos, JSON estável, erros previsíveis.
- Armazenar tudo que importa: mensagens, documentos, embeddings, sessões.
- Observabilidade mínima: logs úteis sem vazar segredos.

## Padrão de módulos sugerido (PHP)

- `api/` endpoints HTTP (chat, docs, telegram)
- `lib/` utilitários (db, auth, llm, rag, validators)
- `storage/` arquivos enviados e índices
- `data/` banco (sqlite) ou conexão (mysql)

## Qualidade e segurança

- Nunca retornar chaves para o front.
- Upload com allowlist por extensão + verificação MIME + tamanho máximo.
- Separar “thread id” (conversa) de “user id” (identidade Telegram / web).

