"use client";

import { useState } from "react";

export default function AISupportChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Buylog AI Support. You help users with Buylog features AND you may answer general questions politely if asked.",
    },
    {
      role: "ai",
      content:
        "Hi 👋 I’m Buylog AI Support. Ask me anything about Buylog or general questions too.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", content: question };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer-support/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.answer || "Sorry, I couldn’t answer that.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Customer Support</h1>

        {/* CHAT BOX */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 h-[400px] overflow-y-auto space-y-4 shadow-sm">
          {messages
            .filter((m) => m.role !== "system")
            .map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] ${
                  msg.role === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "mr-auto bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200"
                }`}
              >
                {msg.content}
              </div>
            ))}

          {loading && (
            <div className="mr-auto bg-gray-200 dark:bg-zinc-800 p-3 rounded-lg text-gray-500 dark:text-zinc-400">
              Buylog AI is typing…
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask Buylog AI anything…"
            className="flex-1 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            disabled={loading}
            onClick={askAI}
            className="px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {/* FALLBACK */}
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-4">
          Need a human?
          <a
            href="/customer-support/chat"
            className="ml-1 text-emerald-600 dark:text-emerald-400 underline"
          >
            Chat with customer care
          </a>
        </p>
      </div>
    </div>
  );
}