# MCF OpenAI NIM Starter

Base inicial para construir aplicações de IA com Next.js, Vercel e NVIDIA NIM, adotando padrões úteis da documentação da OpenAI sem presumir compatibilidade total entre APIs.

## Stack

- Next.js App Router + TypeScript
- Vercel para deploy
- NVIDIA NIM API (`https://integrate.api.nvidia.com/v1`)
- SDK JavaScript `openai`, configurado com `baseURL` compatível

## Requisitos

- Node.js 20+
- Chave de API NVIDIA disponível em https://build.nvidia.com/
- Projeto Vercel conectado ao repositório

## Configuração local

1. Instale dependências: `npm install`
2. Copie `.env.example` para `.env.local`.
3. Preencha `NVIDIA_API_KEY` e, se necessário, `NVIDIA_MODEL`.
4. Execute `npm run dev`.

A chave deve permanecer somente no servidor. Nunca use prefixo `NEXT_PUBLIC_` para `NVIDIA_API_KEY`, nem faça commit de `.env.local`.

## Variáveis de ambiente

- `NVIDIA_API_KEY` (obrigatória para gerar respostas)
- `NVIDIA_BASE_URL` (opcional; padrão `https://integrate.api.nvidia.com/v1`)
- `NVIDIA_MODEL` (opcional; padrão `openai/gpt-oss-20b`; confirme os modelos disponíveis para sua conta)
- `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` (obrigatórias em produção para proteger a interface e a API)

Configure as variáveis diretamente em Vercel → Project → Settings → Environment Variables. Use valores fortes e únicos para o acesso da aplicação. Nunca compartilhe senhas ou chaves no chat.

## Validação

- `npm run lint`
- `npm run build`

A integração real com NVIDIA exige uma chave válida e conectividade externa; não há credenciais incluídas neste repositório.

## Segurança e limites

- A rota NVIDIA é chamada no servidor; a chave nunca é enviada ao cliente.
- Em produção, o middleware exige autenticação HTTP Basic. Se as credenciais não estiverem configuradas, a aplicação falha fechada com HTTP 503.
- A rota valida origem quando o cabeçalho `Origin` está presente, limita o tamanho de entrada e o histórico e aplica um limite de 10 solicitações por minuto por endereço.
- O limitador em memória é apenas uma proteção básica por instância; não é distribuído e não substitui rate limiting no edge/WAF para produção com escala. Mantenha a proteção de deployment da Vercel e configure controles distribuídos antes de expor amplamente.
- Não envie segredos ou dados sensíveis no chat.
- O SDK OpenAI é usado apenas para a interface compatível de Chat Completions. Recursos específicos da OpenAI não são presumidos como suportados pelo NVIDIA NIM.

## Estado

Este repositório é o ponto de partida do MCF-OPENAI-NIM-001. O deploy só deve ser considerado concluído após a Vercel informar estado `READY`, a autenticação ser configurada e a aplicação ser verificada no URL gerado.
