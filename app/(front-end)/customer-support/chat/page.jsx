"use client";

import { useState } from "react";

export default function LiveSupportChat() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!form.message.trim()) return;

    const userMessage = {
      role: "user",
      content: form.message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      await fetch("/api/customer-support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ ...form, message: "" });

      setMessages((prev) => [
        ...prev,
        {
          role: "support",
          content: "Thanks for reaching out. A customer care agent will reply shortly.",
        },
      ]);
    } catch (err) {
      console.error(err);
    }

    setSending(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 p-4">
        <h1 className="text-lg font-semibold">Live Customer Support</h1>
        <p className="text-sm text-zinc-400">
          Chat with a customer care agent
        </p>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-sm">
            Start a conversation with our support team.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-3 rounded-xl text-sm ${
              msg.role === "user"
                ? "ml-auto bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="border-t border-zinc-800 p-4">
        <input
          placeholder="Full Name"
          className="w-full mb-2 bg-zinc-900 border border-zinc-800 rounded p-2 text-sm"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email (optional)"
          className="w-full mb-2 bg-zinc-900 border border-zinc-800 rounded p-2 text-sm"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="flex gap-2">
          <input
            placeholder="Type your message..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-sm"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button
            onClick={sendMessage}
            disabled={sending}
            className="px-4 bg-emerald-600 rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
