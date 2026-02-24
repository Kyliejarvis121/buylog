"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    salePrice: "",
    productStock: "",
    description: "",
    categoryId: "",
    isActive: true,
    imageUrl: "",
    productImages: [],
    sku: "",
    barcode: "",
    unit: "",
    tags: [],
    isWholesale: false,
    wholesalePrice: "",
    wholesaleQty: "",
    productCode: "",
    qty: "",
  });

  // FETCH PRODUCT + CATEGORIES
  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories"),
        ]);

        const prodJson = await productRes.json();
        const catJson = await categoryRes.json();

        if (!prodJson?.success || !prodJson?.data) {
          alert("Product not found");
          return router.push("/dashboard/farmers/products");
        }

        const p = prodJson.data;

        setForm({
          title: p.title ?? "",
          slug: p.slug ?? "",
          price: p.price ?? "",
          salePrice: p.salePrice ?? "",
          productStock: p.productStock ?? 0,
          description: p.description ?? "",
          categoryId: p.categoryId ?? "",
          isActive: p.isActive ?? true,
          imageUrl: p.imageUrl ?? (Array.isArray(p.productImages) ? p.productImages[0] ?? "" : ""),
          productImages: Array.isArray(p.productImages) ? p.productImages : [],
          sku: p.sku ?? "",
          barcode: p.barcode ?? "",
          unit: p.unit ?? "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          isWholesale: !!p.isWholesale,
          wholesalePrice: p.wholesalePrice ?? "",
          wholesaleQty: p.wholesaleQty ?? "",
          productCode: p.productCode ?? "",
          qty: p.qty ?? 1,
        });

        setCategories(Array.isArray(catJson?.data) ? catJson.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
        router.push("/dashboard/farmers/products");
      }
    }

    fetchData();
  }, [productId, router]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: !!checked }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // IMAGE UPLOAD SELECT
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(files);
  };

  // UPLOAD IMAGES
  const uploadSelectedImages = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadProgress(0);

    const uploadedUrls = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/uploadthing", { method: "POST", body: fd });
        const json = await res.json();

        const url = json?.fileUrl || json?.url || json?.data?.fileUrl || json?.data?.url;
        if (url) uploadedUrls.push(url);

        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      if (uploadedUrls.length) {
        setForm((prev) => ({
          ...prev,
          productImages: [...prev.productImages, ...uploadedUrls],
          imageUrl: prev.imageUrl || uploadedUrls[0],
        }));
      }

      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const removeImg = (url) => {
    setForm((prev) => {
      const nextImages = prev.productImages.filter((i) => i !== url);
      const nextMain = prev.imageUrl === url ? nextImages[0] ?? "" : prev.imageUrl;
      return { ...prev, productImages: nextImages, imageUrl: nextMain };
    });
  };

  // SET MAIN IMAGE
  const setMainImage = (url) => setForm((prev) => ({ ...prev, imageUrl: url }));

  // TAGS
  const addTag = (tag) =>
    tag && setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, tag])] }));

  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: String(form.title || ""),
        slug: form.slug || undefined,
        price: form.price !== "" ? Number(form.price) : 0,
        salePrice: form.salePrice !== "" ? Number(form.salePrice) : null,
        productStock: form.productStock !== "" ? Number(form.productStock) : 0,
        qty: form.qty !== "" ? Number(form.qty) : 1,
        description: form.description ?? "",
        categoryId: form.categoryId || null,
        isActive: !!form.isActive,
        imageUrl: form.imageUrl || (form.productImages[0] ?? null),
        productImages: Array.isArray(form.productImages) ? form.productImages : [],
        sku: form.sku || null,
        barcode: form.barcode || null,
        unit: form.unit || null,
        productCode: form.productCode || null,
        tags: Array.isArray(form.tags) ? form.tags : [],
        isWholesale: !!form.isWholesale,
        wholesalePrice: form.wholesalePrice !== "" ? Number(form.wholesalePrice) : 0,
        wholesaleQty: form.wholesaleQty !== "" ? Number(form.wholesaleQty) : 0,
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully");
        router.push("/dashboard/farmers/products");
      } else {
        alert("Failed to update product: " + (data.message || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong updating the product");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const j = await res.json();

      if (j.success) {
        alert("Product deleted");
        router.push("/dashboard/farmers/products");
      } else {
        alert("Delete failed: " + (j.message || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-6 bg-gray-900 text-white">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
            <input
              type="number"
              name="salePrice"
              value={form.salePrice}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-lime-600 text-black rounded"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded mt-2"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        </form>
      </div>
    </div>
  );
}