# Handover Executivo

## Missao

Levar para o `asklobito` o mesmo nivel de maturidade de RAG que hoje existe no `asktel`: baixo custo, auditavel, isolado por tenant, com ingestao operacional real e reindexacao controlada.

## O que foi realmente conquistado no ASKTEL

O `asktel` saiu de um RAG generico para um pipeline completo:

- ingestao de documento com persistencia segura;
- extracao de texto por tipo de arquivo, incluindo PDF selecionavel;
- chunking padronizado;
- indexacao com metadados uteis para busca e auditoria;
- retrieval hibrido lexical com score explicavel;
- isolamento por cliente;
- log da pergunta, contexto enviado e resposta;
- fila de reindexacao para casos assincronos;
- endpoints e UI administrativa para operar a base RAG;
- testes que protegem o comportamento esperado.

## O principio mais importante

No `asklobito`, nao tente "copiar o efeito visual" do RAG. Copie o sistema inteiro:

1. schema
2. ingestao
3. indexacao
4. retrieval
5. auditoria
6. operacao admin
7. testes

Se uma dessas partes faltar, a paridade nao existe.

## Definicao de paridade real

O `asklobito` so pode ser considerado em paridade com o `asktel` quando:

- aceita documentos da base RAG e documentos operacionais de forma separada;
- cria chunks com a mesma politica e metadados;
- recupera contexto apenas do tenant correto;
- registra consultas em trilha auditavel;
- consegue reindexar PDFs e documentos antigos;
- tem testes equivalentes cobrindo chunking, isolamento e score;
- a equipe consegue operar a base documental sem mexer direto no banco.

## Estrategia recomendada

Portar em camadas, nesta ordem:

1. schema e indices;
2. `lib/rag.php` e contratos de retrieval;
3. `lib/doc_ingest.php` e fluxo de persistencia/reindex;
4. endpoints admin de upload/listagem/reindex;
5. auditoria de `ai_queries`;
6. testes;
7. UI/admin.

## O erro que precisamos evitar

O maior risco e implantar o retrieval antes da esteira de ingestao e da reindexacao. Isso cria demos que parecem funcionar, mas falham no primeiro PDF real, no primeiro tenant com base vazia ou na primeira auditoria.
