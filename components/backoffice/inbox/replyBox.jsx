"use client";

import { useState } from "react";

export default function ReplyBox({ chatId, farmerId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId, // ✅ use existing chat
          senderId: farmerId,
          senderType: "farmer",
          text,
        }),
      });

      setText("");
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        className="flex-1 p-2 rounded bg-zinc-800 text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reply to buyer..."
      />
      <button
        onClick={handleReply}
        disabled={loading}
        className="bg-green-600 px-4 rounded text-white"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
