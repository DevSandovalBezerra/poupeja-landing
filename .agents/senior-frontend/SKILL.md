---
name: "senior-frontend"
description: "Projeta e implementa UI/UX em HTML/CSS/JS (stack do Miro). Invoke quando criar/tunar telas, componentes, responsividade, acessibilidade e performance do front."
---

# Senior Frontend

## Objetivo

Elevar a qualidade visual e a usabilidade com baixo custo e stack acessível (HTML + Tailwind CDN + JS “vanilla” + jQuery onde já existir), seguindo o padrão do Miro.

## Quando invocar

- Construção ou ajuste de telas (chat, dashboard, histórico, settings).
- Melhorias de hierarquia visual, espaçamento, tipografia, estados (loading/erro/sucesso).
- Responsividade mobile-first e correções de layout em iOS/Android.
- Acessibilidade (contraste, foco, navegação por teclado, labels).
- Otimização de performance percebida (skeletons, streaming, debounce, lazy load).

## Princípios

- Reusar a estrutura do Miro: Tailwind via CDN + CSS local + JS em arquivos separados.
- Não expor segredos no front-end.
- Preferir mudanças incrementais: melhorar o que existe antes de recriar.
- Tratar mensagens como conteúdo não confiável: escapar/neutralizar HTML quando necessário.

## Checklists rápidos

### UI

- Estados: vazio, carregando, erro, sucesso, sem chave configurada.
- Feedback: toast/alertas consistentes, desabilitar botão durante request.
- Scroll: manter “scroll to bottom” sem quebrar leitura do histórico.

### Mobile

- Input fixo com safe-area (iOS) e prevenção de “jump” do teclado.
- Textarea auto-resize e fonte 16px para evitar zoom no iOS.

### A11y

- Foco visível, aria-label em botões com ícone.
- Contraste mínimo e semântica (header/main/nav).

