"use client"; // since this page uses forms and interactivity

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import Heading from "@/components/backoffice/Heading";
import axios from "axios";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories safely
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getData("categories");
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!title || !price || !categoryId) {
      setError("Title, Price, and Category are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("/api/products", {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        imageUrl,
      });

      if (res.status === 200 || res.status === 201) {
        router.push("/dashboard/farmers/products");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create product.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Heading title="Upload New Product" />
      {error && (
        <div className="text-red-600 mb-4 border p-2 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select category</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 disabled:opacity-50"
        >
          {isSubmitting ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
