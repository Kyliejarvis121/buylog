"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ProductUpload({ farmerId, userId }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    productStock: "",
    productCode: "",
    tags: "",
    isActive: true,

    // wholesale
    isWholesale: false,
    wholesalePrice: "",
    wholesaleQty: "",

    // relation
    category: "",
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!formData.title || !formData.slug || !formData.price) {
        toast.error("Title, slug, and price are required.");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one product image.");
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        salePrice: Number(formData.salePrice),
        productStock: Number(formData.productStock),
        productCode: formData.productCode,
        tags: formData.tags ? formData.tags.split(",") : [],
        isActive: formData.isActive,

        isWholesale: formData.isWholesale,
        wholesalePrice: Number(formData.wholesalePrice),
        wholesaleQty: Number(formData.wholesaleQty),

        imageUrl: images[0], // main image
        productImages: images, // gallery

        farmerId,
        userId,

        // prisma relation format
        category: formData.category
          ? {
              connect: { id: formData.category },
            }
          : undefined,
      };

      const res = await axios.post("/api/products", payload);

      if (res.data?.success) {
        toast.success("Product added successfully!");
        setFormData({
          title: "",
          slug: "",
          description: "",
          price: "",
          salePrice: "",
          productStock: "",
          productCode: "",
          tags: "",
          isActive: true,
          isWholesale: false,
          wholesalePrice: "",
          wholesaleQty: "",
          category: "",
        });
        setImages([]);
      } else {
        toast.error(res.data?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Product Title"
        className="w-full border p-2 rounded mb-3"
        value={formData.title}
        onChange={e => handleChange("title", e.target.value)}
      />

      {/* SLUG */}
      <input
        type="text"
        placeholder="Slug"
        className="w-full border p-2 rounded mb-3"
        value={formData.slug}
        onChange={e => handleChange("slug", e.target.value)}
      />

      {/* PRICE */}
      <input
        type="number"
        placeholder="Price"
        className="w-full border p-2 rounded mb-3"
        value={formData.price}
        onChange={e => handleChange("price", e.target.value)}
      />

      {/* SALE PRICE */}
      <input
        type="number"
        placeholder="Sale Price"
        className="w-full border p-2 rounded mb-3"
        value={formData.salePrice}
        onChange={e => handleChange("salePrice", e.target.value)}
      />

      {/* STOCK */}
      <input
        type="number"
        placeholder="Available Stock Quantity"
        className="w-full border p-2 rounded mb-3"
        value={formData.productStock}
        onChange={e => handleChange("productStock", e.target.value)}
      />

      {/* PRODUCT CODE */}
      <input
        type="text"
        placeholder="Product Code"
        className="w-full border p-2 rounded mb-3"
        value={formData.productCode}
        onChange={e => handleChange("productCode", e.target.value)}
      />

      {/* TAGS */}
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="w-full border p-2 rounded mb-3"
        value={formData.tags}
        onChange={e => handleChange("tags", e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Product Description"
        className="w-full border p-2 rounded mb-3"
        rows={4}
        value={formData.description}
        onChange={e => handleChange("description", e.target.value)}
      />

      {/* CATEGORY */}
      <select
        className="w-full border p-2 rounded mb-3"
        value={formData.category}
        onChange={e => handleChange("category", e.target.value)}
      >
        <option value="">Select Category</option>
        {/* IMPORTANT: Fetch categories in parent and pass them as props if needed */}
        {/* <option value="123">Vegetables</option> */}
      </select>

      {/* WHOLESALE TOGGLE */}
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={formData.isWholesale}
          onChange={e => handleChange("isWholesale", e.target.checked)}
        />
        Wholesale Available?
      </label>

      {formData.isWholesale && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            placeholder="Wholesale Price"
            className="border p-2 rounded"
            value={formData.wholesalePrice}
            onChange={e => handleChange("wholesalePrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Wholesale Qty"
            className="border p-2 rounded"
            value={formData.wholesaleQty}
            onChange={e => handleChange("wholesaleQty", e.target.value)}
          />
        </div>
      )}

      {/* IMAGE UPLOAD */}
      <div className="mb-4">
        <UploadButton
          endpoint="multipleProductsUploader"
          onClientUploadComplete={res => {
            const urls = res.map(f => f.url);
            setImages(prev => [...prev, ...urls]);
            toast.success("Images uploaded!");
          }}
          onUploadError={err => {
            toast.error("Upload failed.");
          }}
        />
      </div>

      {/* PREVIEW IMAGES */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-32 object-cover rounded border"
          />
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded w-full"
      >
        {loading ? "Uploading..." : "Upload Product"}
      </button>
    </div>
  );
}
