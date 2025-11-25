"use client";

import React, { useState } from "react";

export default function ProductUpload({ farmerId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          farmerId,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Product uploaded successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setImageUrl("");
      } else {
        setMessage(data.message || "Failed to upload product.");
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>
      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
