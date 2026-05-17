---
name: "senior-backend"
description: "Implementa backend PHP para chat, RAG, uploads, memória e Telegram com foco em segurança e baixo custo. Invoke quando criar endpoints, DB, integrações e validações."
---

# Senior Backend

## Objetivo

Construir endpoints PHP robustos e baratos para Etelmir, reaproveitando o que existe no Miro e preparando a evolução para RAG, memória e Telegram.

## Quando invocar

- Criar/alterar endpoints PHP (chat proxy, upload, ingestão, busca, histórico).
- Implementar persistência (SQLite/MySQL) e queries para recuperar últimos chats.
- Implementar integração OpenRouter (chave por usuário) e provedores LLM.
- Implementar Telegram bot (webhook, upload de documento, roteamento por thread).
- Segurança: validação de entrada, CORS, rate limit, sanitização, uploads.

## Boas práticas (PHP)

- Validar método HTTP e Content-Type.
- Respostas JSON consistentes: `{ ok: true, data: ... }` / `{ ok: false, error: { code, message } }`.
- Não logar payloads sensíveis (chaves, prompts privados).
- Usar prepared statements para SQL.

## Uploads e documentos

- Allowlist: `.md`, `.txt`, `.pdf`.
- Verificar MIME real (`finfo`) e tamanho máximo.
- Guardar arquivo com nome seguro e metadados no DB.

## Memória

- Persistir mensagens com `user_id`, `thread_id`, `role`, `content`, `created_at`.
- Recuperar “últimos 5” por `user_id + thread_id` para contexto inicial.

