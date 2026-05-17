# 🔄 Session Transfer — {{DATA}} {{HORA}}

**De:** {{AUTOR}}  
**Para:** {{DESTINATARIO}}  
**Branch:** `{{BRANCH}}`  
**Ticket/Issue:** [{{TICKET_ID}}]({{TICKET_URL}})  
**Tempo estimado para retomar:** ~{{TEMPO_RETOMADA}} minutos

---

## 🎯 Objetivo da Sessão

> {{OBJETIVO_EM_1_FRASE}}

**Critério de conclusão (done = quando?):**  
{{CRITERIO_DE_CONCLUSAO}}

---

## 🌿 Estado do Git

```
Branch: {{BRANCH}} → origin/{{BRANCH}}
Commits não enviados: {{N_COMMITS_PENDENTES}}
```

**Arquivos modificados:**
```
{{GIT_STATUS_OUTPUT}}
```

**Últimos commits:**
```
{{GIT_LOG_OUTPUT}}
```

**Stashes:**
```
{{GIT_STASH_LIST}}
```

---

## 📂 Arquivos em Foco

| Arquivo | Motivo / O que estava fazendo |
|---|---|
| `{{ARQUIVO_1}}` | {{DESCRICAO_1}} |
| `{{ARQUIVO_2}}` | {{DESCRICAO_2}} |

**Localização específica mais importante:**  
`{{ARQUIVO}}:{{LINHA}}` — {{DESCRICAO_FUNCAO_OU_BLOCO}}

---

## 🐛 Debug / Erros em Investigação

> *(Preencher apenas se havia um bug/erro sendo investigado)*

**Erro:**  
{{DESCRICAO_ERRO}}

**Hipótese atual:**  
{{HIPOTESE}}

**Já tentado e descartado:**
- {{ABORDAGEM_1}} — descartada porque {{MOTIVO}}
- {{ABORDAGEM_2}} — descartada porque {{MOTIVO}}

**Onde reproduzir:**  
{{COMO_REPRODUZIR}}

---

## ✅ Estado dos Testes

- [ ] Todos passando  
- [x] Testes falhando — ver abaixo

**Testes falhando:**
| Teste | Motivo |
|---|---|
| `{{NOME_TESTE}}` | {{MOTIVO}} |

**Testes novos adicionados nesta sessão:** {{NOVOS_TESTES}}

---

## 🏗️ Decisões Técnicas Tomadas

### Decisão 1: {{TITULO_DECISAO}}
- **O que foi decidido:** {{DECISAO}}
- **Por quê:** {{MOTIVO}}
- **Alternativas rejeitadas:** {{ALTERNATIVAS}}

---

## 🔧 Ambiente Necessário

**Serviços que precisam estar rodando:**
```bash
# Iniciar com:
{{COMANDO_START_SERVICES}}
```

| Serviço | Porta | Comando para subir |
|---|---|---|
| {{SERVICO_1}} | {{PORTA_1}} | `{{COMANDO_1}}` |

**Variáveis de ambiente especiais:** Ver `.env.local` (não commitado)

---

## 📋 Próximos Passos

> Fazer nesta ordem:

- [ ] **1. [AGORA]** {{PROXIMO_PASSO_IMEDIATO_E_ESPECIFICO}}
- [ ] **2.** {{SEGUNDO_PASSO}}
- [ ] **3.** {{TERCEIRO_PASSO}}
- [ ] **4.** {{QUARTO_PASSO}}

---

## 🚧 Blockers

| Blocker | Tipo | Owner | Status |
|---|---|---|---|
| {{BLOCKER_1}} | {{TIPO}} | @{{OWNER}} | {{STATUS}} |

---

## 🔗 Referências

- **Ticket:** {{TICKET_URL}}
- **Docs consultadas:** {{DOCS_URL}}
- **PRs relacionados:** {{PRS_URL}}
- **Conversa de contexto:** {{SLACK_THREAD_URL}}

---

*Gerado por session-transfer skill · {{TIMESTAMP}}*
