# Checklist de Implantacao

## Pre-implantacao

- [ ] Confirmar qual entidade representa tenant no `asklobito`
- [ ] Confirmar onde ficam uploads persistidos
- [ ] Confirmar se ja existe tabela de documentos
- [ ] Confirmar se ha parser de PDF disponivel
- [ ] Confirmar suite de testes existente e como integrar novos testes

## Schema

- [ ] Criar/ajustar tabela equivalente a `doc_chunks`
- [ ] Criar/ajustar tabela equivalente a `rag_reindex_jobs`
- [ ] Criar/ajustar tabela equivalente a `ai_queries`
- [ ] Garantir indices por documento, tenant e status
- [ ] Garantir chaves e deletes coerentes

## Ingestao

- [ ] Criar persistencia segura de arquivo
- [ ] Criar criacao de documento no banco
- [ ] Separar upload operacional de upload admin RAG
- [ ] Adicionar decisao entre indexacao imediata e fila de reindexacao
- [ ] Garantir resposta com status claro (`ready`, `stored`, `queued`, `error`)

## RAG core

- [ ] Portar normalizacao e tokenizacao
- [ ] Portar extracao de keywords
- [ ] Portar chunking 500-1000
- [ ] Portar categorizacao de documento
- [ ] Portar indexacao para `doc_chunks`
- [ ] Portar ranking lexical + proximidade + regex
- [ ] Garantir filtro por tenant em toda consulta

## Reindexacao

- [ ] Criar enqueue de reindex
- [ ] Criar claim/process/complete do job
- [ ] Criar worker CLI ou job equivalente
- [ ] Criar scan de pasta para documentos sem chunk
- [ ] Garantir que PDFs antigos possam ser reprocessados

## Auditoria

- [ ] Persistir pergunta original
- [ ] Persistir pergunta normalizada
- [ ] Persistir contexto enviado ao modelo
- [ ] Persistir resposta do modelo
- [ ] Persistir provider/model

## Operacao admin

- [ ] Implementar upload admin RAG
- [ ] Implementar listagem com status de reindex
- [ ] Implementar delete
- [ ] Implementar reindex por documento
- [ ] Implementar scan manual

## Testes

- [ ] Criar teste unitario de tokenizacao
- [ ] Criar teste unitario/integracao de chunking
- [ ] Criar teste de upload admin gerando chunks
- [ ] Criar teste de scan + reindex
- [ ] Criar teste de isolamento por tenant
- [ ] Criar teste de ranking lexical
- [ ] Criar teste de bonus por proximidade
- [ ] Criar teste de bonus por regex de categoria
- [ ] Criar teste de auditoria em `ai_queries`

## Criterio de aceite

- [ ] Documento texto indexa e aparece no retrieval
- [ ] PDF entra na fila e reindexa com sucesso
- [ ] Nenhuma consulta cruza tenant
- [ ] Admin consegue operar a base sem SQL manual
- [ ] Testes de RAG passam no `asklobito`
