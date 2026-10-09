# Arquitetura inicial

## Fluxo

1. O navegador acessa a aplicação.
2. Em produção, o middleware exige autenticação HTTP Basic; deployments de preview dependem da proteção de deployment da Vercel.
3. O navegador envia a mensagem para `POST /api/chat`.
4. A rota valida a origem e a entrada, aplica limite básico por instância e mantém a chamada ao provedor no servidor.
5. O SDK `openai` envia Chat Completions para o endpoint compatível do NVIDIA NIM.
6. A resposta textual volta ao navegador.

## Componentes

- `middleware.ts`: exige `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` somente quando `VERCEL_ENV=production`; falha fechada se ausentes.
- `app/page.tsx`: interface de chat.
- `app/api/chat/route.ts`: validação, limite básico de solicitações, chamada ao modelo e tratamento genérico de erros.
- `NVIDIA_API_KEY`: segredo de servidor, nunca enviado ao cliente.
- `NVIDIA_BASE_URL` e `NVIDIA_MODEL`: configuração do provedor.

## Decisões e limites

- A integração usa somente o formato Chat Completions do SDK compatível; não pressupõe que recursos específicos da OpenAI existam no NIM.
- Histórico limitado aos últimos 10 itens aceitos, com conteúdo truncado por item.
- Timeout de 25 segundos e uma repetição do SDK.
- A autenticação HTTP Basic protege produção quando as duas variáveis estão definidas. Sem elas, o middleware retorna 503 em vez de expor o app.
- A proteção de preview depende da configuração de Deployment Protection da Vercel; confirme que os previews não estão expostos publicamente.
- O limitador é em memória por instância e não substitui um rate limiter distribuído/edge; não trate isso isoladamente como proteção suficiente para tráfego público em escala.
- A chamada real ao modelo não pode ser validada sem uma chave NVIDIA válida configurada no ambiente.

## Deploy

Configurar `APP_BASIC_AUTH_USER`, `APP_BASIC_AUTH_PASSWORD`, `NVIDIA_API_KEY`, `NVIDIA_BASE_URL` e `NVIDIA_MODEL` diretamente nas variáveis de ambiente do projeto Vercel. Nunca colocar valores secretos em arquivos do repositório.
