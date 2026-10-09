# Arquitetura inicial

## Fluxo

1. O navegador acessa a aplicação com autenticação HTTP Basic no middleware de produção.
2. O navegador envia a mensagem para `POST /api/chat`.
3. A rota valida origem e entrada, aplica limite básico por instância e mantém a chamada ao provedor no servidor.
4. O SDK `openai` envia Chat Completions para o endpoint compatível do NVIDIA NIM.
5. A resposta textual volta ao navegador.

## Componentes

- `middleware.ts`: exige `APP_BASIC_AUTH_USER` e `APP_BASIC_AUTH_PASSWORD` em produção e falha fechada se estiverem ausentes.
- `app/page.tsx`: interface de chat.
- `app/api/chat/route.ts`: validação, limite básico de solicitações, chamada ao modelo e tratamento genérico de erros.
- `NVIDIA_API_KEY`: segredo de servidor, nunca enviado ao cliente.
- `NVIDIA_BASE_URL` e `NVIDIA_MODEL`: configuração do provedor.

## Decisões e limites

- A integração usa somente o formato Chat Completions do SDK compatível; não pressupõe que recursos específicos da OpenAI existam no NIM.
- Histórico limitado aos últimos 10 itens aceitos, com conteúdo truncado por item.
- Timeout de 25 segundos e uma repetição do SDK.
- A autenticação HTTP Basic protege a superfície em produção quando as duas variáveis estão definidas. Sem elas, o middleware retorna 503 em vez de expor o app.
- O limitador é em memória por instância e não substitui um rate limiter distribuído/edge; não trate isso isoladamente como proteção suficiente para tráfego público em escala.
- A chamada real ao modelo não pode ser validada sem uma chave NVIDIA válida configurada no ambiente.

## Deploy

Configurar `APP_BASIC_AUTH_USER`, `APP_BASIC_AUTH_PASSWORD`, `NVIDIA_API_KEY`, `NVIDIA_BASE_URL` e `NVIDIA_MODEL` diretamente nas variáveis de ambiente do projeto Vercel. Nunca colocar valores secretos em arquivos do repositório.
