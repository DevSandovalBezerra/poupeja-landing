# Tutorial: Subir a Landing no Portainer via GitHub + GHCR

## Objetivo

Publicar a landing em `app360.mercantilizar.com.br` usando:

- build no GitHub Actions;
- imagem no GitHub Container Registry (GHCR);
- deploy no Portainer via stack.

## Importante sobre usuário/senha do registry

- Se usar `registry.mercantilizar.com.br`: usuário/senha devem ser reais desse registry.
- Se usar `ghcr.io` com pacote público (nosso caso): você não precisa de `REGISTRY_USERNAME` e `REGISTRY_PASSWORD` no workflow.

## Pré-requisitos

- Repositório público no GitHub: `DevSandovalBezerra/poupeja-landing`.
- Portainer com Docker Swarm ativo.
- Traefik funcionando e rede `traefik-public` existente.
- DNS do subdomínio `app360` apontando para o IP do servidor.

## Passo 1) Workflow de build/push (já criado)

Arquivo:

- `.github/workflows/deploy-landing-ghcr.yml`

Esse workflow:

- roda em `ubuntu-24.04`;
- faz build do `Dockerfile`;
- publica em:
  - `ghcr.io/devsandovalbezerra/poupeja-landing:latest`
  - `ghcr.io/devsandovalbezerra/poupeja-landing:${{ github.sha }}`

## Passo 2) Deixar o pacote público no GHCR

Depois do primeiro push que gerar a imagem:

1. Vá no GitHub do usuário `DevSandovalBezerra`.
2. Abra `Packages` > `poupeja-landing`.
3. Em package settings, marque visibility como `Public`.

Com isso, o Portainer consegue puxar sem credenciais.

## Passo 3) Stack no Portainer

No arquivo de stack já está ajustado para landing:

- `image: ghcr.io/devsandovalbezerra/poupeja-landing:latest`

No Portainer:

1. `Stacks` > sua stack.
2. `Update the stack`.
3. Deploy.

## Passo 4) DNS

No provedor DNS do domínio:

- registro `A`
- host: `app360`
- valor: IP público do servidor

## Passo 5) Validação

- `https://app360.mercantilizar.com.br` abre a landing.
- serviço `landing` em `running`.
- certificado HTTPS válido.

## Troubleshooting rápido

1. `Image pull failed`: pacote GHCR não está público (ou nome/tag incorretos).
2. `404 Traefik`: regra de host diferente de `app360.mercantilizar.com.br`.
3. sem HTTPS: DNS ainda não propagou ou Traefik/ACME com falha.
