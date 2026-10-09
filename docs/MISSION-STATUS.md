# MCF-OPENAI-NIM-001 — Estado da missão

**Estado:** EM ANDAMENTO — correção submetida em PR; CI e deploy ainda em validação  
**Coordenador:** Mestre  
**Fonte de verdade do código:** este repositório GitHub  
**Objetivo:** base inicial de IA com GitHub, Vercel e NVIDIA NIM.

## Evidências executadas

- **Desvio de processo anterior:** arquivos iniciais foram gravados diretamente em `main` via API do GitHub. A skill `MCF-IMPLEMENT-CHANGE` proíbe escrita direta em `main`. Os commits existentes foram preservados; correções adicionais estão na branch `fix/vercel-build-and-api-guards` e foram submetidas no PR #1.
- Deploy de produção que falhou: `4a7ffb13557a952a8791dc070919887357954e97`. A Vercel retornou `errorCode=lint_or_type_error`; sua API de eventos de build retorna 404 para esse deployment.
- **Causa raiz de lint identificada por evidência independente:** o workflow GitHub Actions `CI`, run `37891589849`, falhou na etapa `Lint` em `app/page.tsx:51:9`: regra `@next/next/no-html-link-for-pages` proíbe usar `<a href="/">` para navegação interna e exige `next/link`. O código foi corrigido para usar `Link` de `next/link`. A execução de build foi pulada nesse run porque o lint falhou primeiro.
- A execução de CI também reportou 7 vulnerabilidades de dependências durante `npm install` (1 moderada e 6 altas). A lista detalhada do `npm audit` ainda precisa ser obtida; não executar `npm audit fix --force` sem analisar impactos de breaking changes.
- O PR #1 está aberto: https://github.com/leon337/MCF-OPENAI-NIM-001/pull/1
- A Vercel iniciou deployments de preview para commits da branch. Um dos deployments estava `BUILDING` e o mais recente `QUEUED` na última consulta; nenhum estado `READY` foi confirmado ainda.
- Projeto Vercel: `mcf-openai-nim-001`; o deploy anterior em produção estava em `ERROR`. A proteção SSO da Vercel está habilitada para deployments, exceto domínios customizados.
- Não há evidência confirmada de `NVIDIA_API_KEY` configurada. O endpoint de listagem de variáveis apresentou respostas inconsistentes de 404 entre escopos; valores de segredos não foram solicitados nem expostos.
- Fontes MCF consultadas: `skills/registry.yaml`, MCF-DEC-052 e skill Vercel `deployments-cicd`. O registro contém skills formais de debug, implementação, revisão, testes, PR e deploy. Não há runtime local de agentes confirmado nesta sessão; papéis especializados são revisões simuladas pelo Mestre, não agentes independentes.
- O registro consultado não apresenta skill explícita de aprendizado/postmortem. Este arquivo preserva o aprendizado local como fallback documental; nenhuma fonte oficial do MCF foi alterada.

## Alterações propostas nesta branch

- Corrigida a navegação interna usando `next/link`, causa confirmada da falha de lint no CI.
- Middleware de autenticação HTTP Basic para produção, com falha fechada se as credenciais não forem configuradas.
- Validação obrigatória de origem na rota, limite básico de 10 solicitações por minuto por endereço, e limites de entrada/histórico.
- Documentação de variáveis de ambiente e limites de segurança.

## Critérios de aceite

- [ ] CI: lint e build aprovados após a correção de navegação.
- [ ] PR revisado e integrado conforme gates MCF.
- [ ] Deploy Vercel de produção em estado `READY`.
- [ ] `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` configuradas diretamente na Vercel.
- [ ] `NVIDIA_API_KEY` configurada diretamente na Vercel.
- [ ] Teste real da rota com chave válida e resposta do NVIDIA NIM.
- [ ] Rate limiting distribuído/edge configurado antes de tráfego público em escala.
- [ ] Lista de vulnerabilidades npm analisada e remediação validada.
- [ ] Revisão final de segurança e evidências.

## Dependências remanescentes

Aguardar o novo CI e preview. Para o teste end-to-end, Leandro deve cadastrar as credenciais diretamente no painel Vercel; não enviar segredos no chat.
