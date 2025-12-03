"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { generateUserCode } from "@/lib/generateUserCode";

import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";

export default function ProductUpload({ farmerId }) {
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  async function onSubmit(data) {
    if (productImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    // Generate a unique code for the product/farmer
    const code = generateUserCode("FMR", data.name || "farmer");

    const payload = {
      ...data,
      farmerId,
      productImages,
      isActive: data.isActive || false,
      code, // <- required by Prisma
    };

    try {
      setLoading(true);
      const res = await axios.post("/api/farmers", payload);

      if (res.data.success) {
        alert("Product uploaded successfully");
        reset();
        setProductImages([]);
      } else {
        alert(res.data.message || "Failed to upload product");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading the product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-black text-white p-6 rounded-lg max-w-3xl mx-auto space-y-4"
    >
      <TextInput
        label="Product Title"
        name="title"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Farmer Name"
        name="name"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Farmer Email"
        name="email"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Farmer Phone"
        name="phone"
        register={register}
        errors={errors}
      />
      <TextareaInput
        label="Product Description"
        name="description"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Price"
        name="salePrice"
        type="number"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Stock Quantity"
        name="productStock"
        type="number"
        register={register}
        errors={errors}
      />
      <MultipleImageInput
        imageUrls={productImages}
        setImageUrls={setProductImages}
        endpoint="multipleProductsUploader"
        label="Upload Product Images (up to 5)"
        maxFiles={5}
      />
      <ToggleInput
        label="Publish Product"
        name="isActive"
        register={register}
        trueTitle="Active"
        falseTitle="Draft"
      />
      <SubmitButton
        isLoading={loading}
        buttonTitle="Upload Product"
        loadingButtonTitle="Uploading..."
      />
    </form>
  );
}

