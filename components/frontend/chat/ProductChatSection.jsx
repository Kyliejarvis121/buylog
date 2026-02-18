"use client";
import ReplyBox from "@/components/backoffice/inbox/replyBox";
import { useEffect, useState } from "react";

export default function ProductChatSection({ productId, farmerId, currentUserId }) {
  const [chatId, setChatId] = useState(null);

  // Create or fetch chat for this product
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
        if (data.success) setChatId(data.chat.id);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUserId && !chatId) fetchChat();
  }, [productId, currentUserId]);

  if (!currentUserId) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Contact Seller</h2>
      {chatId && (
        <ReplyBox
          chatId={chatId}
          currentUserId={currentUserId}
          senderType="buyer"
        />
      )}
    </div>
  );
}
