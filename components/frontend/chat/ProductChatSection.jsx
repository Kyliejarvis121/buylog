const handleSend = async () => {
    if (!messageText.trim()) return;
  
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        text: messageText,
        senderId: currentUser.id,
        senderType: "buyer",
      }),
    });
  
    setMessageText("");
  };
  