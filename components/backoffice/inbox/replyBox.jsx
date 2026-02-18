"use client";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";

export default function ReplyBox({ chatId, currentUserId, senderType }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    // Subscribe to Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind("new-message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          senderId: currentUserId,
          senderType,
          text: messageText,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send message");

      setMessageText("");
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      console.error(err);
      alert("Could not send message: " + err.message);
    }
  };

  return (
    <div className="mt-4 border-t border-zinc-700 pt-3">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[70%] break-words ${
              msg.senderType === "farmer"
                ? "bg-green-600 text-white ml-auto"
                : "bg-zinc-700 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
