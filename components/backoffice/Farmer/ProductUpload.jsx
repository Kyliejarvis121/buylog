"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { uploadFiles } from "@/utils/uploadthing";

export default function ProductUpload({ farmerId, categories = [] }) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [uploadingMain, setUploadingMain] = useState(false);

  const [productImagesFiles, setProductImagesFiles] = useState([]);
  const [productImagesUrls, setProductImagesUrls] = useState([]);
  const [uploadingProducts, setUploadingProducts] = useState(false);

  // Upload single main image
  const handleMainImageUpload = async () => {
    if (!mainImageFile) return alert("Please select an image first");

    try {
      setUploadingMain(true);
      const uploaded = await uploadFiles("productImageUploader", [mainImageFile]);
      console.log("Main image uploaded:", uploaded);
      setMainImageUrl(uploaded[0].fileUrl);
      alert("Main image uploaded successfully!");
    } catch (err) {
      console.error("Main image upload failed:", err);
      alert("Upload failed, check console");
    } finally {
      setUploadingMain(false);
    }
  };

  // Upload multiple product images
  const handleProductImagesUpload = async () => {
    if (!productImagesFiles.length) return alert("Select product images first");

    try {
      setUploadingProducts(true);
      const uploaded = await uploadFiles("multipleProductsUploader", productImagesFiles);
      console.log("Product images uploaded:", uploaded);
      setProductImagesUrls(uploaded.map((f) => f.fileUrl));
      alert("Product images uploaded successfully!");
    } catch (err) {
      console.error("Product images upload failed:", err);
      alert("Upload failed, check console");
    } finally {
      setUploadingProducts(false);
    }
  };

  // Submit product to backend
  const onSubmit = async (data) => {
    if (!mainImageUrl) return alert("Upload main image first");

    const payload = {
      ...data,
      farmerId,
      imageUrl: mainImageUrl,
      productImages: productImagesUrls,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      isActive: data.isActive ?? true,
    };

    try {
      console.log("Submitting product:", payload);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Backend error:", result);
        return alert(result.message || "Failed to add product");
      }

      alert("Product added successfully!");
      reset();
      setMainImageFile(null);
      setMainImageUrl("");
      setProductImagesFiles([]);
      setProductImagesUrls([]);
      router.push("/farmer/products");
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Error submitting product, check console");
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow-md max-w-4xl mx-auto my-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            {...register("title")}
            placeholder="Product Title"
            className="border px-2 py-1 rounded"
          />
          <input
            {...register("slug")}
            placeholder="Slug"
            className="border px-2 py-1 rounded"
          />
          <input
            {...register("price")}
            type="number"
            placeholder="Price"
            className="border px-2 py-1 rounded"
          />
          <input
            {...register("salePrice")}
            type="number"
            placeholder="Sale Price"
            className="border px-2 py-1 rounded"
          />
          <select {...register("categoryId")} className="border px-2 py-1 rounded">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full border mt-2 px-2 py-1 rounded"
        />

        <div className="mt-4">
          <label>Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
          />
          <button
            type="button"
            onClick={handleMainImageUpload}
            disabled={uploadingMain}
            className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
          >
            {uploadingMain ? "Uploading..." : "Upload Main Image"}
          </button>
          {mainImageUrl && (
            <img src={mainImageUrl} alt="Main" className="mt-2 h-20" />
          )}
        </div>

        <div className="mt-4">
          <label>Product Images (multiple):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setProductImagesFiles([...e.target.files])}
          />
          <button
            type="button"
            onClick={handleProductImagesUpload}
            disabled={uploadingProducts}
            className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
          >
            {uploadingProducts ? "Uploading..." : "Upload Product Images"}
          </button>
          <div className="flex flex-wrap mt-2 gap-2">
            {productImagesUrls.map((url, i) => (
              <img key={i} src={url} alt={`Product ${i}`} className="h-20" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
