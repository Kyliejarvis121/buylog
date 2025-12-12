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
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);

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

  // Fetch product + categories
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

  // Handle input change
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

  // Handle new image selection
  const handleSelectNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  // Upload selected new images
  const handleUploadImages = async () => {
    if (newImages.length === 0) {
      alert("No images selected to upload");
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (let file of newImages) {
        const fd = new FormData();
        fd.append("file", file);

        const uploadRes = await fetch("/api/uploadthing", {
          method: "POST",
          body: fd,
        });

        const uploadJson = await uploadRes.json();

        const url =
          uploadJson?.fileUrl ||
          uploadJson?.url ||
          uploadJson?.data?.fileUrl ||
          uploadJson?.data?.url;

        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          productImages: [...prev.productImages, ...uploadedUrls],
          imageUrl: prev.imageUrl || uploadedUrls[0],
        }));
      }

      setNewImages([]);
      alert("Images uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImg = (url) => {
    setForm((prev) => {
      const nextImages = prev.productImages.filter((i) => i !== url);
      const nextMain = prev.imageUrl === url ? nextImages[0] ?? "" : prev.imageUrl;
      return { ...prev, productImages: nextImages, imageUrl: nextMain };
    });
  };

  // Set main image
  const setMainImage = (url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  // Tags
  const addTag = (tag) => {
    if (!tag) return;
    setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, tag])] }));
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title || "",
        slug: form.slug || undefined,
        productPrice: form.price !== undefined ? Number(form.price) : undefined,
        price: form.price !== undefined ? Number(form.price) : undefined,
        salePrice: form.salePrice !== "" ? Number(form.salePrice) : null,
        productStock: form.productStock !== "" ? Number(form.productStock) : 0,
        description: form.description ?? "",
        categoryId: form.categoryId || null,
        isActive: !!form.isActive,
        imageUrl: form.imageUrl || null,
        productImages: Array.isArray(form.productImages)
          ? form.productImages
          : [form.productImages],
        sku: form.sku || null,
        barcode: form.barcode || null,
        unit: form.unit || null,
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
        console.error("Update error:", data);
        alert("Failed to update product: " + (data.message || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong updating the product");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
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

  if (loading)
    return <div className="p-6 bg-gray-900 min-h-screen text-white">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* TITLE */}
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
              placeholder="Product title"
              required
            />
          </div>

          {/* IMAGE UPLOAD (NEW IMAGES) */}
          <div>
            <label className="block text-sm mb-1">Add More Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleSelectNewImages}
              className="w-full text-sm text-white"
            />
            {newImages.length > 0 && (
              <button
                type="button"
                onClick={handleUploadImages}
                disabled={uploading}
                className="mt-2 px-4 py-2 bg-green-600 rounded text-white"
              >
                {uploading ? "Uploading..." : "Upload Selected Images"}
              </button>
            )}
          </div>

          {/* IMAGES PREVIEW */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {form.productImages.length === 0 ? (
              <div className="col-span-3 text-sm text-gray-400">No images yet</div>
            ) : (
              form.productImages.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded overflow-hidden border border-gray-700"
                >
                  <img
                    src={url}
                    className="w-full h-32 object-cover"
                    alt={`img-${index}`}
                  />
                  <div className="absolute left-1 top-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setMainImage(url)}
                      className={`text-xs px-2 py-1 rounded ${
                        form.imageUrl === url
                          ? "bg-lime-600 text-black"
                          : "bg-gray-800 text-white"
                      } m-2`}
                    >
                      {form.imageUrl === url ? "Main" : "Set main"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImg(url)}
                      className="text-xs px-2 py-1 rounded bg-red-600 text-white m-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SUBMIT / CANCEL / DELETE */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-lime-600 text-black rounded font-semibold"
            >
              {saving ? "Saving..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/farmers/products")}
              className="px-4 py-2 bg-gray-700 text-white rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded"
            >
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
