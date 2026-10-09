# MCF-OPENAI-NIM-001 — Estado da missão

**Estado:** EM ANDAMENTO — bloqueio externo no provisionamento Vercel  
**Coordenador:** Mestre  
**Fonte de verdade do código:** este repositório GitHub  
**Objetivo:** base inicial de IA com GitHub, Vercel e NVIDIA NIM.

## Evidências executadas

- Repositório inicial estava vazio; confirmado pelo retorno da API GitHub.
- Criados arquivos de aplicação Next.js/TypeScript, rota server-side NVIDIA NIM, interface de chat, variáveis de ambiente de exemplo, documentação e workflow de CI.
- Commits de implementação confirmados pelo GitHub:
  - `2e12c0fda72d4b8aa8ac930c964943839aa7e7a7` — README inicial.
  - `a747abec640e40bb09e3dd8ec17688fbfcbef26c` — rota NVIDIA NIM.
  - `ed0713318dbbfb99a272c2c7bd814d484384c0fb` — interface.
  - `0809bafc5d06b9aabf15b9c35476152bb98f74c3` — workflow CI ajustado.
  - `77fc40dc6ecfa3297bc5c0419a66c8705442cd61` — limite de histórico.
- Arquivos foram lidos novamente via GitHub para confirmar que existem no branch `main`.
- A consulta de status de commit retornou uma lista vazia de status checks; isso **não comprova** que lint/build passaram.
- Não há chave NVIDIA no repositório, como esperado.

## Bloqueio Vercel

- A conta conectada expõe o time `PREDIX AI BR` (`team_D45x1LavGkCy2ifRlrShm2WJ`).
- A tentativa de criar e vincular o projeto `mcf-openai-nim-001` falhou com HTTP 403 `forbidden`: a integração não tem permissão para criar o projeto.
- Consulta subsequente não encontrou projeto Vercel com esse nome.
- Nenhum deploy foi confirmado.

## Critérios de aceite ainda pendentes

- [ ] Lint e build executados com resultado aprovado.
- [ ] Projeto Vercel criado e conectado ao repositório.
- [ ] Variáveis NVIDIA configuradas diretamente na Vercel.
- [ ] Deploy de preview com estado `READY`.
- [ ] Teste da rota com chave válida e resposta real do NVIDIA NIM.
- [ ] Controle de acesso e rate limiting adicionados antes de qualquer exposição pública de produção.
- [ ] Revisão final de segurança e evidências.

## Próxima ação

Desbloquear a criação/vinculação do projeto na Vercel via permissões da integração ou conexão pelo painel Vercel. Depois disso, continuar validação e deploy. Não compartilhar a chave NVIDIA no chat; inseri-la diretamente nas variáveis de ambiente da Vercel.
