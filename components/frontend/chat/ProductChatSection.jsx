"use client";
import ReplyBox from "@/components/backoffice/inbox/replyBox";
import { useEffect, useState } from "react";

export default function ProductChatSection({ productId, farmerId, currentUserId }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  // Create or fetch chat
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            senderId: currentUserId,
            senderType: "buyer",
            text: "Hello!", // placeholder first message
          }),
        });
        const data = await res.json();
        if (data.success) {
          setChatId(data.chat.id);
          setMessages([data.message]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUserId && !chatId) fetchChat();
  }, [productId, currentUserId]);

  if (!currentUserId) return null;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          senderId: currentUserId,
          senderType: "buyer",
          text: inputText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setInputText("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-lg bg-zinc-900">
      <h2 className="text-xl font-semibold mb-2">Contact Seller</h2>

      {/* Messages */}
      <div className="max-h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-xs ${
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
          className="flex-1 bg-zinc-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
