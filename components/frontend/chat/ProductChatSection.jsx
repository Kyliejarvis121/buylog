"use client";

import { useState } from "react";

export default function ProductChatSection({
  productId,
  farmerId,
  currentUserId,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!currentUserId) {
    return (
      <div className="mt-6 text-gray-500">
        Please login to contact seller.
      </div>
    );
  }

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          senderId: currentUserId,
          senderType: "buyer",
          text,
        }),
      });

      setText("");
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-3">
        Contact Seller
      </h2>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
