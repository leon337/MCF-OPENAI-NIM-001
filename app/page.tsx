"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || loading) return;

    const history = messages.slice(-10);
    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "A solicitação não foi concluída.");
      }
      setMessages((current) => [...current, { role: "assistant", content: data.answer! }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="MCF NIM início">
          <span className="brand-mark">M</span>
          <span>MCF <span className="muted">/</span> NIM</span>
        </a>
        <span className="status"><span className="status-dot" /> Starter workspace</span>
      </header>

      <section className="hero">
        <p className="eyebrow">MULTIAGENT COLLABORATION FRAMEWORK</p>
        <h1>Uma base para<br /><span>construir com IA.</span></h1>
        <p className="intro">
          Next.js no frontend, uma rota protegida no servidor e inferência pelo NVIDIA NIM.
          Comece uma conversa para validar a integração.
        </p>
      </section>

      <section className="chat-panel" aria-label="Chat com NVIDIA NIM">
        <div className="chat-heading">
          <div>
            <h2>Chat de teste</h2>
            <p>As mensagens são enviadas ao modelo configurado no servidor.</p>
          </div>
          <span className="model-chip">NVIDIA NIM</span>
        </div>

        <div className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✳</span>
              <p>Integração pronta para configuração</p>
              <span>Defina NVIDIA_API_KEY no ambiente antes de enviar uma mensagem.</span>
            </div>
          ) : (
            messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                <span className="message-role">{message.role === "user" ? "Você" : "NIM"}</span>
                <p>{message.content}</p>
              </div>
            ))
          )}
          {loading && <div className="loading-line"><span /> O modelo está respondendo…</div>}
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        <form className="composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="prompt">Sua mensagem</label>
          <textarea
            id="prompt"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Pergunte algo ao modelo…"
            maxLength={4000}
            rows={2}
            disabled={loading}
          />
          <div className="composer-footer">
            <span>{draft.length}/4000 · Não envie dados sensíveis</span>
            <button type="submit" disabled={loading || !draft.trim()}>
              {loading ? "Enviando…" : "Enviar"}
              <span aria-hidden="true"> ↗</span>
            </button>
          </div>
        </form>
      </section>

      <footer className="footer">
        <span>MCF-OPENAI-NIM-001</span>
        <span>Chaves mantidas no servidor · API compatível com Chat Completions</span>
      </footer>
    </main>
  );
}
