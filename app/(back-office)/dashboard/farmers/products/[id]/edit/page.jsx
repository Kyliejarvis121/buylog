"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    productStock: "",
    description: "",
    categoryId: "",
    isActive: true,
    imageUrl: "",
    productImages: [],
  });

  // Fetch product + categories
  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();

        const categoryRes = await fetch("/api/categories");
        const categoryData = await categoryRes.json();

        if (!productData?.data) {
          alert("Product not found");
          return router.push("/dashboard");
        }

        setForm({
          title: productData.data.title ?? "",
          price: productData.data.price ?? "",
          productStock: productData.data.productStock ?? "",
          description: productData.data.description ?? "",
          categoryId: productData.data.categoryId ?? "",
          isActive: productData.data.isActive ?? true,
          imageUrl: productData.data.imageUrl ?? "",
          productImages: Array.isArray(productData.data.productImages)
            ? productData.data.productImages
            : [],
        });

        setCategories(categoryData.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    }

    fetchData();
  }, [productId, router]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Handle new image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to your /api/upload
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadData.url) {
        uploadedUrls.push(uploadData.url);
      }
    }

    setForm((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...uploadedUrls],
    }));
  };

  // Remove image
  const removeImg = (url) => {
    setForm((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((img) => img !== url),
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully");
        router.push("/dashboard");
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setSaving(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">

        {/* TITLE */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* STOCK */}
        <div>
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            name="productStock"
            value={form.productStock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            name="isActive"
            value={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.value === "true" })
            }
            className="w-full p-2 border rounded"
          >
            <option value="true">Active</option>
            <option value="false">Draft</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        {/* IMAGES UPLOAD */}
        <div>
          <label className="block mb-1">Upload More Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        {/* IMAGES PREVIEW */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {form.productImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                className="w-full h-24 object-cover rounded border"
                alt="product"
              />
              <button
                type="button"
                onClick={() => removeImg(url)}
                className="absolute top-1 right-1 text-white bg-red-500 text-xs px-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
