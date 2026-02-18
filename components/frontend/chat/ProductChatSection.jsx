"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function ProductChatSection({
  productId,
  farmerId,
  currentUserId,
}) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Create chat if it doesn't exist
  useEffect(() => {
    const createChat = async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          senderId: currentUserId,
          senderType: "buyer",
          text: "Hello",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setChatId(data.chat.id);
        setMessages([data.message]);
      }
    };

    if (currentUserId && !chatId) {
      createChat();
    }
  }, [currentUserId]);

  // ✅ Listen for farmer replies
  useEffect(() => {
    if (!chatId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);

    channel.bind("new-message", function (message) {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        senderId: currentUserId,
        senderType: "buyer",
        text,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setText("");
    }
  };

  if (!currentUserId) return null;

  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Contact Seller
      </h2>

      {/* Messages */}
      <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[70%] break-words ${
              msg.senderUserId === currentUserId
                ? "bg-blue-600 text-white ml-auto"
                : "bg-green-600 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 text-white p-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
