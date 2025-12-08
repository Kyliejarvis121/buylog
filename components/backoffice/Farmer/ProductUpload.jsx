"use client";

import React, { useState } from "react";
import { OurFileRouter } from "@/utils/uploadthing"; // ensure this is exported
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId }) {
  const router = useRouter();
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!mainImageUrl) {
      alert("Please upload the main product image first!");
      return;
    }

    data.imageUrl = mainImageUrl;
    data.farmerId = farmerId;

    await makePostRequest(
      setLoading,
      "/api/products",
      data,
      "Product Created",
      reset,
      () => router.refresh()
    );
  };

  const handleImageSelect = (e) => {
    setMainImageFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!mainImageFile) {
      alert("Select an image first");
      return;
    }

    setUploading(true);
    try {
      // Upload using UploadThing API
      const formData = new FormData();
      formData.append("file", mainImageFile);

      const res = await fetch("/api/uploadthing/productImageUploader", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMainImageUrl(result.url);
        alert("Image uploaded successfully!");
      } else {
        console.error(result);
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl p-6 bg-white border rounded shadow mx-auto"
    >
      <div className="grid gap-4">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Stock Quantity" name="productStock" type="number" register={register} errors={errors} />
        <TextareaInput label="Description" name="description" register={register} errors={errors} />
        <ToggleInput label="Active" name="isActive" register={register} trueTitle="Active" falseTitle="Inactive" />

        <div>
          <label className="block mb-1 font-semibold">Main Product Image</label>
          <input type="file" onChange={handleImageSelect} />
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleUploadImage}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {mainImageUrl && <p className="mt-2 text-green-600">Image uploaded: {mainImageUrl}</p>}
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
