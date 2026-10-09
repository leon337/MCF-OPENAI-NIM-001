# MCF-OPENAI-NIM-001 — Estado da missão

**Estado:** EM ANDAMENTO — build Vercel falhou; logs detalhados indisponíveis via integração conectada  
**Coordenador:** Mestre  
**Fonte de verdade do código:** este repositório GitHub  
**Objetivo:** base inicial de IA com GitHub, Vercel e NVIDIA NIM.

## Evidências executadas

- **Desvio de processo anterior:** arquivos iniciais foram gravados diretamente em `main` via API do GitHub. A skill `MCF-IMPLEMENT-CHANGE` proíbe escrita direta em `main`. Os commits existentes foram preservados; esta correção está isolada na branch `fix/vercel-build-and-api-guards` e será proposta via PR.
- Commit de produção que falhou: `4a7ffb13557a952a8791dc070919887357954e97`.
- Vercel confirmou `errorCode=lint_or_type_error`, `errorStep=buildStep` e `npm run build exited with 1`. A API de eventos de build retornou 404 para o deployment, portanto a linha/arquivo da causa não pôde ser confirmada. A causa raiz permanece **não determinada** até a execução de novo build com logs acessíveis.
- O status combinado do commit no GitHub indica `Vercel: failure`; isso confirma falha, não identifica a causa.
- O projeto Vercel `mcf-openai-nim-001` existe, mas o deploy mais recente estava em `ERROR`; aliases existem e a proteção SSO da Vercel está habilitada para deployments, exceto domínios customizados.
- Consulta de variáveis de ambiente retornou lista vazia quando o endpoint foi acessível sem escopo alternativo; uma consulta posterior com ID/time retornou 404. Não há evidência confirmada de `NVIDIA_API_KEY` configurada.
- Fontes MCF consultadas: `skills/registry.yaml`, MCF-DEC-052 e skill Vercel `deployments-cicd`. O registro contém skills formais de debug, implementação, revisão, testes, PR e deploy; não foi encontrado mecanismo executável de agentes locais nesta sessão. Papéis especializados são revisões simuladas pelo Mestre, não agentes independentes.
- O registro consultado não apresenta skill explícita de aprendizado/postmortem. O aprendizado desta missão é documentado aqui como fallback local; nenhuma fonte oficial do MCF foi alterada.

## Alterações propostas nesta branch

- Troca da importação de `FormEvent` por importação de tipo e remoção da asserção não nula na resposta da UI, como limpeza de tipagem/lint; isso ainda não prova que esses pontos eram a causa original.
- Middleware de autenticação HTTP Basic para produção, com falha fechada se as credenciais não forem configuradas.
- Limite básico de 10 solicitações por minuto por endereço na rota de chat, validação de origem e limites de entrada/histórico.
- Documentação de variáveis e limites de segurança.

## Critérios de aceite

- [ ] Build e lint aprovados por CI/Vercel.
- [ ] PR revisado e integrado conforme gates MCF.
- [ ] Deploy Vercel de produção em estado `READY`.
- [ ] `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` configuradas diretamente na Vercel.
- [ ] `NVIDIA_API_KEY` configurada diretamente na Vercel.
- [ ] Teste real da rota com chave válida e resposta do NVIDIA NIM.
- [ ] Rate limiting distribuído/edge configurado antes de tráfego público em escala.
- [ ] Revisão final de segurança e evidências.

## Próxima dependência externa

Aguardar CI/preview da branch e inspecionar logs. Para o teste end-to-end, Leandro deve cadastrar as credenciais diretamente no painel Vercel; não enviar segredos no chat.
