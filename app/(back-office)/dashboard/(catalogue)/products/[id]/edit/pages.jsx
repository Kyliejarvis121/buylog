"use client";
import React, { useState } from "react";

export default function EditProductForm({ product, onSaved }) {
  const [title, setTitle] = useState(product.title || "");
  const [price, setPrice] = useState(product.price || 0);
  const [description, setDescription] = useState(product.description || "");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, description }),
    });
    const j = await res.json();
    setLoading(false);
    if (j.success) {
      alert("Saved");
      onSaved && onSaved(j.data);
    } else {
      alert(j.message || "Save failed");
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
