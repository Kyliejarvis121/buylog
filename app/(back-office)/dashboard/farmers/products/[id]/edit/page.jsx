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
  const [selectedFiles, setSelectedFiles] = useState([]); // 👈 NEW

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

  // ==================================================
  // FETCH PRODUCT + CATEGORIES
  // ==================================================
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
          productImages: Array.isArray(p.productImages)
            ? p.productImages
            : [],
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

  // ==================================================
  // FORM HANDLERS
  // ==================================================
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

  // ==================================================
  // IMAGE SELECTION (NO UPLOAD YET)
  // ==================================================
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  // ==================================================
  // IMAGE UPLOAD BUTTON (ACTUAL UPLOAD)
  // ==================================================
  const uploadSelectedImages = async () => {
    if (selectedFiles.length === 0) return alert("Select images first");

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (let file of selectedFiles) {
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

        setSelectedFiles([]); // reset input
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ==================================================
  // IMAGE HELPERS
  // ==================================================
  const removeImg = (url) => {
    setForm((prev) => {
      const nextImages = prev.productImages.filter((i) => i !== url);
      const nextMain = prev.imageUrl === url ? nextImages[0] ?? "" : prev.imageUrl;
      return { ...prev, productImages: nextImages, imageUrl: nextMain };
    });
  };

  const setMainImage = (url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  // ==================================================
  // TAGS
  // ==================================================
  const addTag = (tag) => {
    if (!tag) return;
    setForm((prev) => ({
      ...prev,
      tags: [...new Set([...prev.tags, tag])],
    }));
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        price: Number(form.price),
        salePrice: form.salePrice !== "" ? Number(form.salePrice) : null,
        productStock: Number(form.productStock || 0),
        description: form.description,
        categoryId: form.categoryId || null,
        isActive: !!form.isActive,
        imageUrl: form.imageUrl || null,
        productImages: form.productImages,
        sku: form.sku || null,
        barcode: form.barcode || null,
        unit: form.unit || null,
        tags: form.tags,
        isWholesale: !!form.isWholesale,
        wholesalePrice: Number(form.wholesalePrice || 0),
        wholesaleQty: Number(form.wholesaleQty || 0),
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
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // DELETE PRODUCT
  // ==================================================
  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const j = await res.json();

      if (j.success) {
        alert("Product deleted");
        router.push("/dashboard/farmers/products");
      } else {
        alert(j.message || "Delete failed");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6 bg-gray-900 min-h-screen text-white">Loading…</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* ALL YOUR EXISTING FIELDS REMAIN UNCHANGED */}

          {/* ADD MORE IMAGES */}
          <div>
            <label className="block text-sm mb-1">Add More Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="text-sm"
            />

            <button
              type="button"
              onClick={uploadSelectedImages}
              disabled={uploading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {uploading ? "Uploading…" : "Upload Selected Images"}
            </button>
          </div>

          {/* IMAGE PREVIEW */}
          <div className="grid grid-cols-3 gap-3">
            {form.productImages.map((url, i) => (
              <div key={i} className="relative border border-gray-700 rounded">
                <img src={url} className="w-full h-32 object-cover" />
                <div className="absolute top-1 left-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setMainImage(url)}
                    className={`text-xs px-2 py-1 rounded ${
                      form.imageUrl === url
                        ? "bg-lime-600 text-black"
                        : "bg-gray-800"
                    }`}
                  >
                    {form.imageUrl === url ? "Main" : "Set main"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImg(url)}
                    className="text-xs px-2 py-1 bg-red-600 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-lime-600 text-black rounded"
            >
              {saving ? "Saving…" : "Update Product"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto px-4 py-2 bg-red-600 rounded"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
