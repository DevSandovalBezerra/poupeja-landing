---
name: system-ideation
description: >
  Guia completo de técnicas de ideação e planejamento estruturado para design de sistemas.
  Use este skill sempre que o usuário quiser planejar, arquitetar ou fazer brainstorming de
  um sistema — mesmo que não use palavras técnicas. Gatilhos: "como planejar meu sistema",
  "quais técnicas usar para arquitetura", "como levantar requisitos", "vamos fazer um
  brainstorming do sistema", "como evitar falhas no planejamento", "como priorizar features",
  "event storming", "pré-mortem", "reverse brainstorming", "SCAMPER", qualquer contexto de
  levantamento de requisitos ou design de software em grupo. Não espere que o usuário peça
  explicitamente — se o contexto for de planejar ou estruturar um sistema, use este skill.
---

# System Ideation — Técnicas de Ideação e Planejamento para Sistemas

Este skill organiza as melhores técnicas de ideação para planejamento de sistemas de software,
com instruções de aplicação, variações, armadilhas comuns e combinações recomendadas.

---

## Como usar este skill

1. **Identifique o contexto** do usuário: fase do projeto, tamanho da equipe, tipo de sistema.
2. **Selecione as técnicas** mais adequadas usando a Matriz de Seleção abaixo.
3. **Aplique cada técnica** seguindo o passo a passo detalhado.
4. **Combine técnicas** usando os Combos Recomendados ao final.

---

## Matriz de Seleção Rápida

| Objetivo | Técnica Primária | Técnica Complementar |
|----------|-----------------|----------------------|
| Entender o domínio e fluxos | Event Storming | Mind Map por Personas |
| Gerar muitas alternativas de solução | Brainwriting 6-3-5 | SCAMPER em Componentes |
| Descobrir requisitos de falha/segurança | Reverse Brainstorming | Pré-mortem |
| Priorizar o que construir primeiro | Matriz Impacto × Esforço | — |
| Inovar em arquitetura | SCAMPER + Analogia de Domínio | — |
| Mitigar riscos antes de começar | Pré-mortem | Reverse Brainstorming |

---

## Técnicas Detalhadas

### 1. Brainwriting 6-3-5

**O que é:** Variante silenciosa do brainstorming que elimina o viés de vozes dominantes.

**Como aplicar:**
- 6 participantes (adapte para 3–8 se necessário)
- Cada um escreve **3 ideias** sobre o tema em **5 minutos** numa folha/quadro
- Passa para o próximo, que **lê e expande** as ideias existentes — sem apagar
- Repete por 6 rodadas → potencial de até 108 ideias brutas

**Variações:**
- *Assíncrono (remoto):* use um doc compartilhado; cada pessoa tem 30 min por rodada
- *Focado:* defina o tema por camada (ex: "apenas autenticação", "apenas observabilidade")
- *2-2-2 (equipes pequenas):* 2 pessoas, 2 ideias, 2 minutos — mais ágil

**Armadilhas comuns:**
- ❌ Escrever ideias genéricas demais ("usar cache" sem especificar onde/como)
- ❌ Apagar ou ignorar ideias anteriores em vez de complementá-las
- ✅ Defina o escopo antes de começar: "estamos pensando apenas em [módulo X]"

**Saída esperada:** Lista bruta de alternativas de solução para triagem posterior

---

### 2. Mind Map por Personas

**O que é:** Mapa mental centrado em atores do sistema para revelar requisitos escondidos.

**Como aplicar:**
1. Coloque o ator principal no centro (ex: `Usuário Final`, `Admin`, `Serviço Externo`)
2. Ramifique nas dimensões: **Necessidades → Restrições → Eventos → Dados → Integrações**
3. Para cada folha do mapa, pergunte: *"O que acontece se isso falhar?"*
4. Repita para cada persona relevante do sistema

**Dimensões recomendadas para sistemas:**
```
[Persona]
├── O que ela precisa fazer? (casos de uso)
├── O que ela não pode fazer? (restrições/permissões)
├── O que a faz iniciar uma ação? (eventos/gatilhos)
├── Que dados ela produz/consome?
├── Com quais outros sistemas ela interage?
└── O que a frustra? (requisitos não-funcionais implícitos)
```

**Armadilhas:**
- ❌ Fazer apenas o mapa do usuário final — admins, sistemas externos e operadores são personas igualmente importantes
- ✅ Use o mapa para descobrir **dependências entre funcionalidades** antes de estimar

---

### 3. Event Storming

**O que é:** Técnica colaborativa de modelagem por eventos de domínio numa linha do tempo.

**Código de cores padrão (post-its):**
| Cor | Representa | Exemplo |
|-----|-----------|---------|
| 🟠 Laranja | Evento de domínio (passado) | `Pedido Criado` |
| 🔵 Azul | Comando (ação que dispara o evento) | `Criar Pedido` |
| 🟡 Amarelo | Ator (quem executa o comando) | `Usuário` |
| 🟣 Roxo | Política (regra de negócio) | `Se estoque < 0, notificar` |
| 🟢 Verde | Agregado (entidade que muda de estado) | `Pedido` |
| 🩷 Rosa | Sistema externo | `Gateway de Pagamento` |

**Como aplicar (Big Picture — 2h):**
1. Espalhe eventos na linha do tempo sem ordem (caos inicial)
2. Ordene cronologicamente
3. Identifique lacunas: *"Que evento deveria existir entre X e Y?"*
4. Adicione comandos, atores e políticas
5. Marque **pontos de pivô** (eventos que mudam completamente o fluxo)

**Como aplicar (Design Level — 4h):**
- Aprofunde cada agregado individualmente
- Defina invariantes (regras que nunca devem ser violadas)
- Identifique limites de contexto (Bounded Contexts)

**Ferramentas digitais:** Miro, Mural, FigJam, EventStormingBoard.com

**Armadilhas:**
- ❌ Usar substantivos como eventos ("Pedido") — eventos são sempre **verbos no passado** ("Pedido Confirmado")
- ❌ Pular para a solução técnica antes de mapear todos os eventos
- ✅ Inclua domain experts (não só devs) — eles conhecem os casos extremos

---

### 4. Reverse Brainstorming

**O que é:** Inverte a pergunta para descobrir o que ninguém quer dizer diretamente.

**Como aplicar:**
1. Formule a pergunta inversa: *"O que faria este sistema falhar miseravelmente?"*
2. Gere ideias de desastre sem censura (10–20 min)
3. Para cada ideia de falha, derive o **requisito positivo correspondente**
4. Priorize os requisitos gerados por frequência e impacto

**Exemplos de perguntas inversas:**
- "Como garantir que os dados dos usuários vazem?"  → Segurança/Criptografia
- "Como fazer o sistema cair sob carga normal?"  → Performance/Load testing
- "Como garantir que ninguém consiga usar o sistema?"  → UX/Onboarding
- "Como perder todos os dados em produção?"  → Backup/Disaster recovery
- "Como criar inconsistências nos dados?"  → Transações/Idempotência

**Saída esperada:** Lista de requisitos não-funcionais e casos extremos priorizados

---

### 5. SCAMPER em Componentes

**O que é:** Checklist de provocações criativas aplicadas a componentes esperados do sistema.

**As 7 lentes:**

| Letra | Ação | Pergunta para o sistema |
|-------|------|------------------------|
| **S** | Substituir | E se usarmos eventos imutáveis em vez de banco relacional? |
| **C** | Combinar | E se cache + fila fossem um único componente? |
| **A** | Adaptar | Como um sistema de roteamento de aviões resolveria nosso problema de filas? |
| **M** | Modificar/Magnificar | E se escalarmos esse componente para 100x o volume atual? |
| **P** | Usar para outro fim | Podemos reutilizar nosso módulo de auditoria como pipeline de analytics? |
| **E** | Eliminar | O que acontece se removermos completamente o banco de staging? |
| **R** | Reverter/Rearranjar | E se o cliente processasse os dados em vez do servidor? |

**Como aplicar:**
1. Liste os componentes esperados do sistema
2. Aplique cada lente SCAMPER a pelo menos 2 componentes
3. Registre as ideias — mesmo as que parecem absurdas inicialmente
4. Filtre com a Matriz Impacto × Esforço

---

### 6. Analogia de Domínio

**O que é:** Transfere conceitos de um domínio diferente para resolver problemas de arquitetura.

**Como aplicar:**
1. Descreva o problema central em uma frase
2. Escolha 1–2 domínios analógicos (ver tabela abaixo)
3. Liste 5–10 mecanismos do domínio analógico
4. Para cada mecanismo, pergunte: *"Qual é o equivalente no nosso sistema?"*

**Domínios analógicos úteis para sistemas:**

| Problema no sistema | Domínio analógico | Conceitos transferíveis |
|--------------------|-------------------|------------------------|
| Filas e prioridade | Aeroporto | Controle de pouso, esteiras, gate, atrasos, overbooking |
| Concorrência | Restaurante | Cozinha, comanda, garçom, fila de espera, reserva |
| Cache e invalidação | Biblioteca | Prateleira local vs. depósito, prazo de devolução |
| Pub/Sub e eventos | Jornal/Newsletter | Assinante, edição, tiragem, cancelamento |
| Rate limiting | Pedágio | Fluxo por hora, cobrança por uso, bloqueio de faixa |
| Retry e fallback | Sistema de energia | Gerador reserva, disjuntor, reestabelecimento gradual |

---

### 7. Matriz Impacto × Esforço

**O que é:** Filtro de priorização para ideias geradas nas sessões anteriores.

**Como aplicar:**
1. Liste todas as ideias/funcionalidades geradas
2. Para cada item, estime (1–5):
   - **Impacto:** valor para o negócio/usuário + redução de risco técnico
   - **Esforço:** complexidade de implementação + incerteza técnica
3. Posicione numa matriz 2×2:

```
Alto Impacto │  PRIORIDADE MÁXIMA  │  PLANEJAR COM CUIDADO
             │  (Fazer agora)      │  (Quebrar em partes)
─────────────┼─────────────────────┼──────────────────────
Baixo Impacto│  QUICK WINS         │  EVITAR / DESCARTAR
             │  (Fazer se sobrar)  │  (Não vale o custo)
             └─────────────────────┴──────────────────────
               Baixo Esforço           Alto Esforço
```

**Dica:** Separe impacto técnico de impacto de negócio. Um item pode ter alto impacto técnico
(desbloqueia outras coisas) mas baixo impacto percebido pelo usuário — isso ainda é prioridade.

---

### 8. Pré-mortem (Pre-Mortem)

**O que é:** Análise prospectiva de falhas antes de o projeto começar.

**Como aplicar:**
1. Declare: *"Imagine que estamos em [data futura] e o sistema falhou gravemente."*
2. Cada participante escreve **individualmente** 3–5 possíveis causas (5–10 min)
3. Compartilhe e agrupe por categoria (técnica, processo, escopo, time, externo)
4. Vote nas mais prováveis e impactantes
5. Para cada causa priorizada, defina:
   - **Sinal de alerta precoce** (como detectar antes de virar catástrofe)
   - **Ação de mitigação** (o que fazer agora para reduzir o risco)

**Categorias comuns de falha em sistemas:**
- 📐 Escopo mal definido / requisitos ambíguos
- 🔗 Dependências externas fora do controle
- 📈 Subestimativa de carga/escala
- 🔐 Segurança tratada como afterthought
- 🔄 Integrações legadas com comportamento inesperado
- 👥 Falta de alinhamento entre stakeholders técnicos e de negócio

---

## Combos Recomendados

### 🎯 Combo: Entendimento Profundo (4–6h)
```
Event Storming (Big Picture)
  → Mind Map por Personas (preencher lacunas)
  → Matriz Impacto × Esforço (priorizar o que modelar em detalhe)
```

### 🛡️ Combo: Arquitetura Resiliente (2–3h)
```
Reverse Brainstorming (descobrir falhas)
  → Pré-mortem (antecipar riscos)
  → SCAMPER (explorar alternativas robustas)
```

### 🚀 Combo: Ideação Rápida (1–2h)
```
Brainwriting 6-3-5 (gerar alternativas)
  → Analogia de Domínio (expandir perspectivas)
  → Matriz Impacto × Esforço (decidir)
```

### 🏗️ Combo: Projeto Completo (1–2 dias)
```
Event Storming → Mind Map → Brainwriting
  → Reverse Brainstorming → Pré-mortem
  → SCAMPER → Matriz Impacto × Esforço
```

---

## Checklist de Facilitação

Antes de qualquer sessão:
- [ ] Definiu o escopo? (qual sistema/módulo está em foco)
- [ ] Tem domain experts + devs + stakeholders na sala?
- [ ] Preparou o ambiente (quadro, post-its, timer, ferramenta digital)?
- [ ] Estabeleceu timeboxes para cada fase?
- [ ] Tem alguém registrando decisões e próximos passos?

Depois de cada sessão:
- [ ] Ideias registradas em formato persistente (doc, Miro, Jira)?
- [ ] Próximos passos definidos com responsáveis e prazos?
- [ ] Decisões arquiteturais documentadas com justificativa (ADRs)?

---

## Dica de Ouro

> Brainstorming sem estrutura de captura e sem próximos passos = zero resultado.
> O valor não está nas ideias geradas, mas nas **decisões tomadas** e nos **riscos mitigados**.
