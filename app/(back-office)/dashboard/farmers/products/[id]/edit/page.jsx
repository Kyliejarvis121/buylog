"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMore, setUploadingMore] = useState(false);

  const [newImages, setNewImages] = useState([]); // Add more images

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!data?.data) {
          toast.error("Product not found");
          return;
        }

        setProduct(data.data);
      } catch (error) {
        toast.error("Failed to load product");
      }
    }

    fetchProduct();
  }, [id]);

  // -------------------------------------------------------------
  // Upload NEW additional images only
  // -------------------------------------------------------------
  const handleUploadAdditionalImages = async () => {
    if (!newImages.length) {
      toast.error("Select images first");
      return;
    }

    setUploadingMore(true);

    try {
      const uploadedUrls = [];

      for (const file of newImages) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

        const cloud = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const res = await cloud.json();
        if (res.secure_url) uploadedUrls.push(res.secure_url);
      }

      // Merge newly uploaded images into product
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      toast.success("Images uploaded successfully");
      setNewImages([]);
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploadingMore(false);
    }
  };

  // -------------------------------------------------------------
  // UPDATE PRODUCT
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Product updated");
      router.push("/backoffice/dashboard");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center text-white mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#111] p-6 rounded-xl shadow-xl border border-[#222]">

        <h1 className="text-2xl font-bold mb-6 text-green-400">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="w-full p-3 rounded bg-[#1a1a1a] border border-[#333] text-white"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
              className="w-full p-3 rounded bg-[#1a1a1a] border border-[#333] text-white"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full p-3 rounded bg-[#1a1a1a] border border-[#333] text-white"
            />
          </div>

          {/* SHOW EXISTING IMAGES */}
          <div>
            <label className="block mb-1">Current Images</label>

            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={120}
                  height={120}
                  alt="Product"
                  className="rounded border border-[#333]"
                />
              ))}
            </div>
          </div>

          {/* ADD MORE IMAGES */}
          <div className="bg-[#0f0f0f] p-4 rounded-lg border border-[#222]">
            <label className="block mb-2 text-green-300">Add More Images</label>

            <input
              type="file"
              multiple
              onChange={(e) => setNewImages([...e.target.files])}
              className="w-full p-2 bg-[#1a1a1a] rounded border border-[#333] text-white"
            />

            {newImages.length > 0 && (
              <p className="mt-2 text-sm text-gray-400">
                {newImages.length} image(s) selected
              </p>
            )}

            {/* UPLOAD BUTTON */}
            <button
              type="button"
              onClick={handleUploadAdditionalImages}
              disabled={uploadingMore}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 p-3 rounded text-white font-semibold"
            >
              {uploadingMore ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
