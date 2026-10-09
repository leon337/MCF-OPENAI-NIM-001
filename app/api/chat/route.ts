import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request): string {
  // Vercel appends the connecting client address to x-forwarded-for.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const address = forwardedFor?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  return address || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) return true;

  // Bound memory growth in long-lived instances.
  if (requestCounts.size > 2_000) {
    for (const [entryKey, entry] of requestCounts) {
      if (entry.resetAt <= now) requestCounts.delete(entryKey);
    }
  }
  return false;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Origem da requisição não permitida." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Cabeçalho de origem inválido." }, { status: 400 });
    }
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { error: "Limite temporário de solicitações atingido. Tente novamente em um minuto." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Informe uma mensagem." }, { status: 400 });
  }

  const input = body as { message?: unknown; history?: unknown };
  if (typeof input.message !== "string" || !input.message.trim()) {
    return NextResponse.json({ error: "A mensagem não pode ficar vazia." }, { status: 400 });
  }
  if (input.message.length > 4000) {
    return NextResponse.json({ error: "A mensagem excede o limite de 4.000 caracteres." }, { status: 413 });
  }

  const history: ChatMessage[] = Array.isArray(input.history)
    ? input.history
        .slice(-10)
        .filter(
          (item): item is ChatMessage =>
            !!item &&
            typeof item === "object" &&
            ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant") &&
            typeof (item as ChatMessage).content === "string",
        )
        .map((item) => ({ role: item.role, content: item.content.slice(0, 2000) }))
    : [];

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "A integração ainda não está configurada. Defina NVIDIA_API_KEY nas variáveis do ambiente do servidor." },
      { status: 503 },
    );
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
      timeout: 25_000,
      maxRetries: 1,
    });

    const completion = await client.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente técnico claro e cuidadoso. Se não tiver certeza, declare a incerteza. Nunca peça nem revele chaves de API, senhas ou outros segredos.",
        },
        ...history,
        { role: "user", content: input.message.trim() },
      ],
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer || typeof answer !== "string") {
      return NextResponse.json({ error: "O modelo não retornou uma resposta de texto." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    // Avoid returning provider error details or request metadata to the browser.
    console.error("NVIDIA NIM request failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Não foi possível obter resposta do NVIDIA NIM. Verifique a configuração e tente novamente." },
      { status: 502 },
    );
  }
}
