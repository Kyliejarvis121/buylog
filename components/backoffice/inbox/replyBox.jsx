"use client"; // ✅ MUST be at the top

import React, { useState } from "react";

export default function ReplyBox({ chatId, farmerId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          senderId: farmerId,
          senderType: "farmer",
          text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setText(""); // clear input
      } else {
        alert("Failed to send message: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        className="flex-1 p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        placeholder="Type a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSend}
        disabled={loading}
      >
        Send
      </button>
    </div>
  );
}
