# Findings

## Estado atual do RAG no ASKTEL

- O `asktel` nao usa vetor/embedding em producao; o motor atual e um RAG hibrido leve, lexical e auditavel.
- O nucleo do retrieval mora em `lib/rag.php`.
- O pipeline de ingestao e reindexacao mora em `lib/doc_ingest.php`.
- O worker assincromo de reindexacao mora em `tools/rag_reindex_worker.php`.
- A administracao de documentos RAG passa por `api/admin_rag_upload.php` e `api/docs.php`.
- O upload operacional do produto continua separado do upload administrativo da base RAG.

## Capacidades que precisam existir no AskLobito para haver paridade

- chunking entre 500 e 1000 caracteres;
- tokens normalizados e keywords por chunk;
- categoria, origem e score base em cada chunk;
- scoring lexical com proximidade e bonus por regex de categoria;
- isolamento por `client_id` ou equivalente de tenant;
- auditoria de consultas em `ai_queries`;
- fila de reindexacao para PDFs e documentos sem chunk;
- extracao de PDF selecionavel;
- UI/admin para listar, reindexar, escanear e remover documentos.

## Provas de maturidade encontradas

- `tests/unit/rag_test.php` cobre tokenizacao e chunking.
- `tests/integration/accounting_phase1_test.php` cobre upload admin RAG, scan e reindex.
- `tests/integration/accounting_phase3_test.php` cobre chunking, isolamento por tenant, ranking lexical, bonus de proximidade e bonus por regex.
- `docs/summary-25-04-2026.md` confirma separacao do upload admin RAG, scan/reindex e parser PDF.
- `asktel-agent-hybrid-rag-master-plan.md` e `asktel-agent-phased-roadmap.md` mostram a intencao arquitetural e a execucao consolidada.

## Dependencias tecnicas sensiveis

- `smalot/pdfparser` para extracao de PDF selecionavel.
- schema de `doc_chunks` e `rag_reindex_jobs`.
- tabela `ai_queries` para rastrear contexto enviado ao modelo.
- indices por cliente/documento para evitar degradacao do retrieval.

## Maior risco de uma copia mal feita

Copiar apenas o `lib/rag.php` para o `asklobito` sem portar schema, ingestao, reindexacao, endpoints admin e testes. Isso gera um "RAG pela metade": busca existe, mas a base nao se sustenta operacionalmente.
