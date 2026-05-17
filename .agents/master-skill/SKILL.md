---
name: master-skill
description: Orquestrador de ambiente de desenvolvimento com agentes de IA. Instala frameworks (BMad, SpecKit, Antigravity Kit) e carrega skills externas. Ativado exclusivamente por /master-skill.
---

# Master Skill

**Gatilho de Ativação:** Exclusivamente via comando `/master-skill`

A `master-skill` atua como um orquestrador do seu ambiente de desenvolvimento utilizando agentes de IA. Ela foi desenhada para operar globalmente no Google Antigravity, Claude Code e Codex.

## Responsabilidades Principais

1. **Instalação e configuração de frameworks de agente:**
   Permite a instalação e a configuração automática de frameworks voltados ao desenvolvimento baseado em agentes de IA, incluindo mas não se limitando a **BMad**, **SpecKit** e **Antigravity Kit**. Como orquestrador, a skill executará toda a configuração técnica e o scaffolding necessários para o framework que o usuário solicitar.

2. **Carregamento de skills externas:**
   Permite adicionar ao contexto ativo as skills armazenadas num diretório (pasta) externo específico e customizado. Isso as tornará visíveis e acessíveis para todos os agentes de IA durante a sessão em andamento.

---

## Fluxo de Configuração Inicial (Primeira Execução)

Na primeira vez que o comando `/master-skill` for invocado na sessão ou no projeto (quando as configurações ainda não estiverem estabelecidas), a skill **NÃO PODE** tomar nenhuma ação de instalação sem antes realizar um setup interativo. 

Você deve interromper o processo e apresentar ao usuário **duas perguntas essenciais**:

1. **"Qual framework de agente você deseja instalar e configurar no seu projeto? (ex: BMad, SpecKit, Antigravity Kit ou outro)"**
2. **"Qual é o caminho do diretório (pasta) externo onde estão localizadas as suas skills locais que deseja disponibilizar neste ambiente?"**

*Somente prossiga (passando pela Socratic Gate) quando o usuário fornecer as respostas para as duas configurações acima.*

---

## Protocolo de Execução após a Configuração

1. **Setup do Framework:**
   - Com a resposta da pergunta 1, inicie o processo de instalação e crie os arquivos de configuração, diretórios (ex: `.agent/`) e manifestos requeridos pelo framework selecionado. Utilize comandos shell aprovados pelo usuário.
2. **Injeção de Contexto das Skills:**
   - Acesse o diretório fornecido na pergunta 2.
   - Analise os subdiretórios ou arquivos `.md` contidos nele para indexar as skills extras.
   - Forneça um sumário rápido das skills extras que agora estão mapeadas e podem ser usadas pelos especialistas do ambiente.
3. **Reporte:**
   - Avise o usuário explicitamente quando a orquestração do ambiente for concluída com sucesso.
