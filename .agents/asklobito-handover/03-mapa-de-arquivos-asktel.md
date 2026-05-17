# Mapa de Arquivos do ASKTEL

Use este arquivo como mapa de referencia para saber de onde cada comportamento deve ser portado.

## Planejamento e estado consolidado

- `asktel-agent-hybrid-rag-master-plan.md`
  - plano mestre da arquitetura e das fases do RAG contabil
- `asktel-agent-phased-roadmap.md`
  - resumo executivo da execucao por fase
- `docs/summary-25-04-2026.md`
  - estado recente do que foi efetivamente entregue

## Nucleo RAG

- `lib/rag.php`
  - stopwords, normalizacao, tokenizacao e keywords
  - chunking
  - categorizacao de documento
  - extracao de texto e PDF
  - indexacao em `doc_chunks`
  - ranking hibrido
  - log de consultas em `ai_queries`

## Ingestao e reindexacao

- `lib/doc_ingest.php`
  - persistencia do upload
  - criacao do registro de documento
  - contagem de chunks
  - fila de reindexacao
  - worker logic para processar fila
  - upload admin RAG
  - upload operacional contabil

- `tools/rag_reindex_worker.php`
  - worker CLI para processar `rag_reindex_jobs`

## Schema e indices

- `lib/db.php`
  - cria e evolui `doc_chunks`
  - cria `rag_reindex_jobs`
  - cria `ai_queries`
  - adiciona indices que tornam retrieval e fila viaveis

## Endpoints operacionais

- `api/admin_rag_upload.php`
  - entrada dedicada para documentos da base RAG administrativa

- `api/docs.php`
  - listagem de documentos
  - visualizacao do estado de reindexacao
  - reindexacao manual
  - scan da pasta
  - delete

- `api/upload.php`
  - upload operacional do produto
  - nao confundir com a base RAG admin

## Consumo do RAG na experiencia principal

- `lib/chat_core.php`
  - usa `etelmir_rag_search(...)`
  - injeta o contexto RAG no prompt
  - responde com fontes quando houver hits

- `lib/accounting_rules_engine.php`
  - usa `asktel_rag_search_chunks(...)`
  - monta contexto para sugestoes contabil/fiscais

- `lib/accounting_prompt_builder.php`
  - registra quais chunks foram usados e como entram no prompt

## UI e superficie admin

- `index.php`
  - controles de uso do RAG
  - painel de documentos RAG

- `js/app.js`
  - comportamento da UI para upload/listagem/reindexacao

## Testes que provam comportamento

- `tests/unit/rag_test.php`
  - tokenizacao e chunking

- `tests/integration/accounting_phase1_test.php`
  - upload admin RAG
  - scan de pasta
  - fila e processamento de reindexacao

- `tests/integration/accounting_phase3_test.php`
  - chunking no tamanho alvo
  - isolamento por tenant
  - ranking lexical
  - bonus de proximidade
  - bonus por regex/categoria
  - log em `ai_queries`

## Regra de ouro para o AskLobito

Nao porte por nome de arquivo apenas. Porte por responsabilidade:

- dados
- ingestao
- retrieval
- auditoria
- operacao
- testes

Se o `asklobito` tiver outra estrutura de pastas, mantenha as responsabilidades equivalentes.
