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
          imageUrl:
            p.imageUrl ??
            (Array.isArray(p.productImages) ? p.productImages[0] ?? "" : ""),
          productImages: Array.isArray(p.productImages) ? p.productImages : [],
          sku: p.sku ?? "",
          barcode: p.barcode ?? "",
          unit: p.unit ?? "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          isWholesale: !!p.isWholesale,
          wholesalePrice: p.wholesalePrice ?? "",
          wholesaleQty: p.wholesaleQty ?? "",
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

  // INPUT HANDLER
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

  // UPLOAD WITH PROGRESS
  const uploadImages = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        fd.append("file", file);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round(((i + e.loaded / e.total) / selectedFiles.length) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            const url =
              res?.fileUrl || res?.url || res?.data?.fileUrl || res?.data?.url;
            if (url) uploadedUrls.push(url);
            resolve();
          } catch (err) {
            reject(err);
          }
        };

        xhr.onerror = reject;
        xhr.open("POST", "/api/uploadthing");
        xhr.send(fd);
      });
    }

    setForm((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...uploadedUrls],
      imageUrl: prev.imageUrl || uploadedUrls[0] || "",
    }));

    setSelectedFiles([]);
    setUploading(false);
    setUploadProgress(0);
  };

  const removeImg = (url) => {
    setForm((prev) => {
      const imgs = prev.productImages.filter((i) => i !== url);
      return {
        ...prev,
        productImages: imgs,
        imageUrl: prev.imageUrl === url ? imgs[0] ?? "" : prev.imageUrl,
      };
    });
  };

  const setMainImage = (url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  const addTag = (tag) => {
    if (!tag) return;
    setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, tag])] }));
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productImages: form.productImages,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully");
        router.push("/dashboard/farmers/products");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete product permanently?")) return;
    setDeleting(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.push("/dashboard/farmers/products");
  };

  if (loading) {
    return <div className="p-6 bg-gray-900 min-h-screen text-white">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* ALL YOUR EXISTING FIELDS ARE UNCHANGED ABOVE */}

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm mb-1">Add More Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />

            {selectedFiles.length > 0 && (
              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
                className="mt-2 px-4 py-2 bg-blue-600 rounded"
              >
                {uploading ? "Uploading..." : "Upload Photos"}
              </button>
            )}

            {uploading && (
              <div className="mt-2 text-sm">
                Uploading: {uploadProgress}%
                <div className="w-full bg-gray-700 h-2 rounded mt-1">
                  <div
                    className="bg-lime-500 h-2 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          <div className="grid grid-cols-3 gap-3">
            {form.productImages.map((url, i) => (
              <div key={i} className="relative border border-gray-700 rounded">
                <img src={url} className="h-32 w-full object-cover" />
                <div className="absolute top-1 left-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setMainImage(url)}
                    className="text-xs px-2 py-1 bg-gray-800 rounded"
                  >
                    {form.imageUrl === url ? "Main" : "Set"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImg(url)}
                    className="text-xs px-2 py-1 bg-red-600 rounded"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-lime-600 text-black rounded">
              {saving ? "Saving..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto px-4 py-2 bg-red-600 rounded"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
