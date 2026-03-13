"use client";
import { useState } from "react";

export default function ReplyBox({ chatId, farmerId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;

    if (!chatId || !farmerId) {
      alert("Missing chat or farmer ID");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          senderId: farmerId,      // ✅ REQUIRED
          senderType: "farmer",    // ✅ REQUIRED
          text: text,              // ✅ REQUIRED
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to send");
      }

      setText("");
    } catch (err) {
      console.error("SEND ERROR:", err);
      alert("Could not send message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reply..."
        className="flex-1 bg-zinc-800 text-white p-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

