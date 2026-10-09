# Arquitetura inicial

## Fluxo

1. O navegador envia a mensagem para `POST /api/chat`.
2. A rota Next.js valida a entrada e mantém a chamada no servidor.
3. O SDK `openai` envia Chat Completions para o endpoint compatível do NVIDIA NIM.
4. A resposta textual volta ao navegador.

## Componentes

- `app/page.tsx`: interface de chat.
- `app/api/chat/route.ts`: validação, chamada ao modelo e tratamento genérico de erros.
- `NVIDIA_API_KEY`: segredo de servidor, nunca enviado ao cliente.
- `NVIDIA_BASE_URL` e `NVIDIA_MODEL`: configuração do provedor.

## Decisões e limites

- A integração usa somente o formato Chat Completions do SDK compatível; não pressupõe que recursos específicos da OpenAI existam no NIM.
- Histórico limitado aos últimos 10 itens aceitos, com conteúdo truncado por item.
- Timeout de 25 segundos e uma repetição do SDK.
- A rota não tem autenticação nem rate limiting distribuído. Não expor como endpoint público de produção até adicionar controle de acesso e proteção contra abuso/custos.
- A chamada real ao modelo não pode ser validada sem uma chave NVIDIA válida configurada no ambiente.

## Deploy

A integração Git da Vercel deve apontar para este repositório, com framework Next.js e diretório raiz padrão. Configurar `NVIDIA_API_KEY`, `NVIDIA_BASE_URL` e `NVIDIA_MODEL` em variáveis de ambiente do projeto Vercel. Nunca colocar valores secretos em arquivos do repositório.
