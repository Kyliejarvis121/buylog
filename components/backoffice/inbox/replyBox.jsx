"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

export default function ChatBox({ chatId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

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

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        senderId: currentUser.id,
        senderType: "customer",
        text,
      }),
    });

    setText("");
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b font-semibold">
        Contact Seller
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              m.senderId === currentUser.id
                ? "ml-auto bg-green-600 text-white"
                : "mr-auto bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {m.text}
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}