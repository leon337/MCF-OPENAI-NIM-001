# MCF-OPENAI-NIM-001 — Estado da missão

**Estado:** PARCIALMENTE CONCLUÍDA — CI e preview aprovados; PR, produção e NVIDIA NIM ainda bloqueados por gates/credenciais  
**Coordenador:** Mestre  
**Fonte de verdade do código:** este repositório GitHub  
**Objetivo:** base inicial de IA com GitHub, Vercel e NVIDIA NIM.

## Evidências executadas

- **Desvio de processo anterior:** arquivos iniciais foram gravados diretamente em `main` via API do GitHub. A skill `MCF-IMPLEMENT-CHANGE` proíbe escrita direta em `main`. As correções seguintes foram isoladas na branch `fix/vercel-build-and-api-guards` e submetidas no PR #1.
- Deploy que originalmente falhou: commit `4a7ffb13557a952a8791dc070919887357954e97`, erro Vercel `lint_or_type_error`.
- **Causa raiz confirmada pelo GitHub Actions:** `app/page.tsx:51:9` usava `<a href="/">` para navegação interna, violando `@next/next/no-html-link-for-pages`. Corrigido para `Link` de `next/link`.
- CI do PR #1 no run `37891698352` concluiu com sucesso: instalação, lint e build passaram. O log de build mostra Next.js 15.5.27 e geração das rotas concluída.
- O log de instalação identificou 7 vulnerabilidades npm (1 moderada, 6 altas). Foi adicionado ao CI um relatório detalhado de `npm audit` para orientar remediação sem aplicar atualizações breaking automaticamente; o novo relatório ainda depende da próxima execução.
- Preview Vercel mais recente observado: ID `dpl_Cg1AATa6nwiuKsBRf1gjFAu3rAmh`, estado `READY`, URL https://mcf-openai-nim-001-8llwqk6gu-predix-ai-br.vercel.app, commit `0c6289b7e4c271bd238b79a664a4f9401fccb280`. É um preview, não prova produção ativa.
- O projeto Vercel informa `live=false`; variáveis listadas retornaram `envs=[]` e `hiddenProductionEnvCount=0`. Não há evidência de credenciais NVIDIA ou de autenticação da aplicação configuradas.
- O PR #1 continua aberto e sem reviews registradas. O MCF `MCF-GIT-PR-RELEASE` exige gate presente e integração quando autorizada; não foi feito merge nem release de produção sem gate/revisão.
- A proteção SSO da Vercel está habilitada para deployments, exceto domínios customizados. O middleware foi ajustado para aplicar Basic Auth apenas quando `VERCEL_ENV=production`, evitando bloquear previews por ausência de credenciais de produção.
- Fontes consultadas: `skills/registry.yaml`, MCF-DEC-052 e skill Vercel `deployments-cicd`. Não há runtime de agentes independentes confirmado; os papéis especializados foram simulados pelo Mestre no ChatGPT.
- O registro oficial não contém skill explícita de aprendizagem/postmortem. Este documento é o fallback documental da missão; nenhuma fonte oficial do MCF foi alterada.

## Alterações na branch

- Navegação interna corrigida para `next/link`.
- Middleware de Basic Auth em produção, falhando fechado quando faltam credenciais.
- Validação de origem, limites de entrada/histórico e limitador de 10 solicitações por minuto por instância.
- Relatório detalhado de dependências vulneráveis adicionado ao CI.
- README e arquitetura descrevem variáveis e limitações.

## Critérios de aceite

- [x] CI lint e build aprovados para commit `0c6289b7e4c271bd238b79a664a4f9401fccb280`.
- [x] Preview Vercel em estado `READY` para esse commit.
- [ ] Novo CI aprovado após ajuste de middleware e relatório npm audit.
- [ ] PR revisado e integrado conforme gates MCF.
- [ ] Deploy de produção em estado `READY`.
- [ ] `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` configuradas diretamente na Vercel.
- [ ] `NVIDIA_API_KEY` configurada diretamente na Vercel.
- [ ] Teste real da rota com resposta NVIDIA NIM.
- [ ] Vulnerabilidades npm analisadas e remediação validada.
- [ ] Rate limiting distribuído/edge configurado antes de tráfego público em escala.
- [ ] Revisão final de segurança e smoke test de produção.

## Dependências remanescentes

Leandro precisa inserir as credenciais diretamente no painel Vercel. O gate de revisão/integração do PR também precisa ser satisfeito antes de release de produção. Não enviar segredos pelo chat.
