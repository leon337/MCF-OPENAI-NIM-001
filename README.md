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

Configure as mesmas variáveis em Vercel → Project → Settings → Environment Variables.

## Validação

- `npm run lint`
- `npm run build`

A integração real com NVIDIA exige uma chave válida e conectividade externa; não há credenciais incluídas neste repositório.

## Segurança e limites

- A API é chamada por uma rota server-side (`/api/chat`).
- **Não publique como serviço aberto de produção ainda.** A interface não possui autenticação nem rate limiting distribuído; proteja o preview e implemente controles de acesso/limite de uso antes de expor a endpoint publicamente.
- A rota valida formato e tamanho básico da entrada e limita o histórico enviado ao provedor.
- Não envie segredos ou dados sensíveis no chat.
- O SDK OpenAI é usado apenas para a interface compatível de Chat Completions. Recursos específicos da OpenAI não são presumidos como suportados pelo NVIDIA NIM.

## Estado

Este repositório é o ponto de partida do MCF-OPENAI-NIM-001. O deploy só deve ser considerado concluído após a Vercel informar estado `READY` e a aplicação ser verificada no URL gerado.