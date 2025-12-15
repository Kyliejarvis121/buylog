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

  // Upload more images states
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

  // Handle selecting files (no upload yet)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(files);
  };

  // Upload selected images
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

  // Remove image
  const removeImg = (url) => {
    setForm((prev) => {
      const nextImages = prev.productImages.filter((i) => i !== url);
      const nextMain = prev.imageUrl === url ? nextImages[0] ?? "" : prev.imageUrl;
      return { ...prev, productImages: nextImages, imageUrl: nextMain };
    });
  };

  // Set main image
  const setMainImage = (url) => setForm((prev) => ({ ...prev, imageUrl: url }));

  // Add/remove tags
  const addTag = (tag) => tag && setForm((prev) => ({ ...prev, tags: [...new Set([...prev.tags, tag])] }));
  const removeTag = (tag) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  // Submit update
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
        productImages: Array.isArray(form.productImages) ? form.productImages : [form.productImages],
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
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
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

  if (loading) return <div className="p-6 bg-gray-900 min-h-screen text-white">Loading...</div>;

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

          {/* SLUG */}
          <div>
            <label className="block text-sm mb-1">Slug (optional)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"
              placeholder="product-slug"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* PRICE */}
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            </div>

            {/* SALE PRICE */}
            <div>
              <label className="block text-sm mb-1">Sale Price</label>
              <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            </div>
          </div>

          {/* STOCK / QTY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Stock</label>
              <input type="number" name="productStock" value={form.productStock} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            </div>
            <div>
              <label className="block text-sm mb-1">Qty</label>
              <input type="number" name="qty" value={form.qty} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            </div>
          </div>

          {/* SKU / BARCODE / UNIT */}
          <div className="grid grid-cols-3 gap-4">
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit (e.g. 1kg)" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
          </div>

          {/* PRODUCT CODE */}
          <div>
            <label className="block text-sm mb-1">Product Code</label>
            <input name="productCode" value={form.productCode} onChange={handleChange} placeholder="Product code" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white">
              <option value="">No category</option>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
            </select>
          </div>

          {/* WHOLESALE */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isWholesale" checked={!!form.isWholesale} onChange={handleChange} className="accent-lime-500"/>
              <span className="text-sm">Wholesale</span>
            </label>
            <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} placeholder="Wholesale price" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
            <input name="wholesaleQty" value={form.wholesaleQty} onChange={handleChange} placeholder="Wholesale min qty" className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"/>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white h-32"/>
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-sm mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                id="newTag"
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (val) {
                      addTag(val);
                      e.target.value = "";
                    }
                  }
                }}
                className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded text-white"
              />
              <div className="inline-flex items-center gap-2">
                {form.tags.map((t) => (
                  <span key={t} className="px-2 py-1 bg-gray-700 text-sm rounded flex items-center gap-2">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-2 text-xs text-red-400">x</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* IMAGES UPLOAD */}
          <div>
            <label className="block text-sm mb-1">Upload More Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-white"/>
            {selectedFiles.length > 0 && (
              <button type="button" onClick={uploadSelectedImages} disabled={uploading} className="mt-2 px-4 py-2 bg-blue-600 rounded text-white">
                {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Image(s)`}
              </button>
            )}
            {uploading && (
              <div className="mt-2">
                <div className="text-xs text-gray-300 mb-1">Uploading: {uploadProgress}%</div>
                <div className="w-full h-2 bg-gray-700 rounded">
                  <div className="h-2 bg-lime-500 rounded" style={{ width: `${uploadProgress}%` }}/>
                </div>
              </div>
            )}
          </div>

          {/* IMAGES PREVIEW */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {form.productImages.length === 0 ? (
              <div className="col-span-3 text-sm text-gray-400">No images yet</div>
            ) : (
              form.productImages.map((url, index) => (
                <div key={index} className="relative group rounded overflow-hidden border border-gray-700">
                  <img src={url} className="w-full h-32 object-cover" alt={`img-${index}`} />
                  <div className="absolute left-1 top-1 flex gap-1">
                    <button type="button" onClick={() => setMainImage(url)} className={`text-xs px-2 py-1 rounded ${form.imageUrl === url ? "bg-lime-600 text-black" : "bg-gray-800 text-white"} m-2`}>
                      {form.imageUrl === url ? "Main" : "Set main"}
                    </button>
                    <button type="button" onClick={() => removeImg(url)} className="text-xs px-2 py-1 rounded bg-red-600 text-white m-2">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-lime-600 text-black rounded font-semibold">
              {saving ? "Saving..." : "Update Product"}
            </button>
            <button type="button" onClick={() => router.push("/dashboard/farmers/products")} className="px-4 py-2 bg-gray-700 text-white rounded">Cancel</button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="ml-auto px-4 py-2 bg-red-600 text-white rounded">
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
