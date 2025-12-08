"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ourFileRouter } from "@/utils/uploadthing"; // your UploadThing utils
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";

export default function ProductUpload({ farmerId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      salePrice: "",
      productStock: 0,
      qty: 0,
      productCode: "",
      isActive: true,
      isWholesale: false,
      wholesalePrice: "",
      wholesaleQty: "",
    },
  });

  const isWholesale = watch("isWholesale");

  const handleUpload = async () => {
    try {
      // Trigger UploadThing file upload
      const res = await ourFileRouter.productImageUploader();
      if (res && res[0]?.fileUrl) setImageUrl(res[0].fileUrl);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) return alert("Please upload a product image");

    const payload = {
      ...data,
      farmerId,
      imageUrl,
      productImages: [imageUrl], // optional extra images
      tags: [],
    };

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Product created successfully!");
        router.refresh();
      } else {
        alert(result.message || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl p-4 bg-white border rounded-lg shadow mx-auto my-4">
      <div className="grid gap-4">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Stock" name="productStock" type="number" register={register} errors={errors} />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} />
        <TextareaInput label="Description" name="description" register={register} errors={errors} />
        <ToggleInput label="Active" name="isActive" register={register} trueTitle="Active" falseTitle="Inactive" />
        <ToggleInput label="Wholesale" name="isWholesale" register={register} trueTitle="Yes" falseTitle="No" />

        {isWholesale && (
          <>
            <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
            <TextInput label="Wholesale Quantity" name="wholesaleQty" type="number" register={register} errors={errors} />
          </>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {imageUrl ? "Image Uploaded" : "Upload Product Image"}
          </button>
          {imageUrl && <span className="text-green-600">Uploaded: {imageUrl}</span>}
        </div>

        <SubmitButton
          isLoading={loading}
          buttonTitle="Add Product"
          loadingButtonTitle="Creating Product..."
        />
      </div>
    </form>
  );
}
