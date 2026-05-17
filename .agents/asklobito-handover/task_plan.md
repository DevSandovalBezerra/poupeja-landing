# Task Plan

## Goal
Preparar um pacote de handover completo para replicar no `asklobito` os avancos de RAG implementados no `asktel`.

## Scope

- In:
  - arquitetura atual do RAG no `asktel`
  - mapa de arquivos, endpoints, tabelas e testes
  - plano de paridade por etapas
  - checklist de implantacao e validacao
- Out:
  - alteracoes no codigo do `asklobito`
  - migracoes executadas no `asklobito`
  - deploy do `asklobito`

## Action Items

- [x] Ler os planos mestres e o resumo recente do `asktel` -> Verify: marcos e fases consolidados
- [x] Localizar arquivos do pipeline RAG, ingestao, reindexacao, auditoria e UI -> Verify: mapa tecnico fechado
- [x] Identificar contratos minimos de schema, endpoints e testes -> Verify: dependencias documentadas
- [x] Estruturar pacote de handover em `.agents/asklobito-handover` -> Verify: pasta com ordem de leitura clara
- [x] Escrever blueprint de paridade para o `asklobito` -> Verify: etapas, riscos e criterios de aceite definidos
- [x] Escrever checklist de implantacao e validacao -> Verify: execucao pode ser acompanhada sem improviso

## Done When

- [x] O pacote cobre implementacao, dependencias, riscos e validacao
- [x] O time consegue portar o RAG para o `asklobito` sem depender de contexto oral
