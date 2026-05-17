# Validacao e Go-Live

## Validacao tecnica minima

Antes de dizer que o `asklobito` herdou o RAG do `asktel`, rode esta bateria:

1. migracoes/schema aplicados sem erro;
2. upload admin de `.txt` indexando chunks;
3. upload admin de `.pdf` enfileirando ou indexando corretamente;
4. worker de reindex processando fila e atualizando status;
5. listagem de documentos mostrando estado coerente;
6. retrieval retornando chunks do tenant correto;
7. consulta auditada em `ai_queries`;
8. suite de testes RAG verde.

## Smoke manual recomendado

### Caso 1 - Base texto

- subir um `.txt` com regra simples;
- perguntar algo que dependa exatamente desse texto;
- verificar se o `asklobito` recupera a fonte correta.

### Caso 2 - PDF

- subir um PDF selecionavel;
- confirmar criacao ou fila de reindex;
- rodar worker;
- perguntar algo contido no PDF;
- confirmar que o chunk reaparece no contexto.

### Caso 3 - Isolamento

- criar dois tenants;
- indexar documento diferente em cada um;
- perguntar do tenant A enquanto logado/escopado em A;
- confirmar que nada do tenant B aparece.

## Riscos de producao que merecem gate

- parser PDF ausente ou parcialmente instalado;
- falta de indices em `doc_chunks`;
- fila de reindex criada mas sem worker real;
- endpoints admin sem protecao por perfil;
- retrieval sem filtro de tenant;
- teste verde local com fixture pequena, mas sem smoke com arquivos reais.

## Recomendacao de rollout

### Etapa 1

Liberar schema, ingestao e reindexacao em ambiente interno.

### Etapa 2

Liberar upload admin RAG e validar com base documental pequena.

### Etapa 3

Ligar retrieval para fluxos controlados e observar logs.

### Etapa 4

So depois da auditoria estar confiavel, ampliar uso para consultas reais do produto.

## Done When

- o `asklobito` opera o mesmo ciclo de vida documental do `asktel`;
- a equipe consegue explicar como um chunk entrou, foi recuperado e foi usado;
- a paridade e sustentada por testes e por operacao real, nao so por promessa de codigo.
