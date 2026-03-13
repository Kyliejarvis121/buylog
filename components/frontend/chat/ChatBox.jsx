"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function ChatBox({ chatId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!chatId) return;

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chats/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        senderId: currentUser.id,
        text,
      }),
    });

    setText("");
  };

  return (
    <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
      <div className="max-h-64 overflow-y-auto mb-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`py-1 px-2 my-1 rounded ${
              m.senderId === currentUser.id
                ? "bg-green-200 text-green-900 self-end"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            <span className="font-semibold">{m.senderId === currentUser.id ? "You" : "Seller"}: </span>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
