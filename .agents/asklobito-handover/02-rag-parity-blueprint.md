# RAG Parity Blueprint

## Approach

Vamos reproduzir no `asklobito` o RAG do `asktel` como uma capacidade operacional, nao como uma feature isolada. O foco e manter a mesma previsibilidade: retrieval explicavel, custo baixo, manutencao simples e comportamento coberto por testes.

## Fase 1 - Fundacao de dados

### Objetivo

Garantir que o `asklobito` tenha o mesmo terreno de banco para sustentar ingestao, chunks, auditoria e reindexacao.

### Minimo obrigatorio

- tabela equivalente a `documents`;
- tabela equivalente a `doc_chunks`;
- tabela equivalente a `rag_reindex_jobs`;
- tabela equivalente a `ai_queries`;
- indices por documento, cliente e status;
- campo de isolamento por tenant (`client_id` ou equivalente).

### Campos que nao podem faltar em `doc_chunks`

- `doc_id`
- `client_id`
- `chunk_index`
- `categoria`
- `chunk_text`
- `chunk_tokens`
- `palavras_chave`
- `score_base`
- `origem`
- `created_at`

## Fase 2 - Ingestao e persistencia

### Objetivo

Fazer o `asklobito` receber, armazenar e preparar documentos para indexacao de forma segura.

### Componentes a espelhar

- diretorio seguro de armazenamento;
- persistencia do arquivo com nome controlado;
- criacao do registro de documento;
- separacao entre upload operacional e upload da base RAG admin;
- contagem de chunks por documento;
- verificacao se o documento precisa de fila de reindexacao.

### Comportamentos esperados

- arquivos texto podem ser indexados de imediato;
- PDFs podem ser enfileirados para reindexacao assincrona;
- um documento sem texto extraivel nao deve quebrar o sistema;
- o estado do documento deve refletir se houve indexacao ou apenas armazenamento.

## Fase 3 - Extracao e chunking

### Objetivo

Garantir que a materia-prima do retrieval no `asklobito` seja igual a do `asktel`.

### Politica de chunking do ASKTEL

- alvo de 500 a 1000 caracteres;
- quebra por blocos semanticos antes de quebrar brutalmente;
- merge do resto muito curto com chunk anterior quando necessario;
- limpeza e normalizacao antes da tokenizacao.

### Funcoes-conceito a reproduzir

- normalizacao textual;
- tokenizacao com stopwords;
- extracao de keywords;
- definicao de categoria do documento;
- extracao de texto por tipo de arquivo;
- indexacao do documento em chunks.

## Fase 4 - Retrieval hibrido

### Objetivo

Reproduzir a busca do `asktel` sem inventar camada vetorial desnecessaria.

### Sinais usados no score

- hit exato lexical;
- hit expandido por termos relacionados;
- cobertura dos termos da pergunta;
- bonus de proximidade entre termos;
- bonus por regex dependente da categoria;
- score base do chunk.

### Regras operacionais

- sempre filtrar por tenant;
- retornar top chunks com score, origem e categoria;
- permitir filtro por categoria quando aplicavel;
- manter o retrieval auditavel e explicavel.

## Fase 5 - Auditoria

### Objetivo

Fazer o `asklobito` provar o que enviou para o modelo.

### Minimo obrigatorio em `ai_queries`

- pergunta original;
- pergunta normalizada;
- contexto enviado;
- resposta do modelo;
- provider/model;
- `client_id`;
- usuario responsavel quando existir.

## Fase 6 - Operacao admin

### Objetivo

Permitir que a equipe mantenha a base RAG sem depender de scripts manuais.

### Capacidade minima

- upload admin de documento RAG;
- listagem de documentos com status de reindexacao;
- reindexacao manual por documento;
- scan da pasta para capturar documentos sem chunk;
- remocao de documento com limpeza coerente.

## Fase 7 - Testes de paridade

### Testes minimos a clonar por comportamento

- tokenizacao basica;
- chunking com faixa de tamanho;
- upload admin gerando chunks;
- scan encontrando documento sem chunk;
- isolamento por tenant;
- ranking lexical;
- bonus de proximidade;
- bonus por regex de categoria;
- log de consulta AI.

## Done When

- o `asklobito` consegue indexar documentos reais;
- a base RAG administrativa pode ser operada pela equipe;
- o retrieval retorna contexto correto do tenant correto;
- a trilha de auditoria permite reconstruir uma resposta;
- a suite de testes confirma esses comportamentos.
