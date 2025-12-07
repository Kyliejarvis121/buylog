"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ImageInput from "@/components/FormInputs/ImageInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId }) {
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [tags, setTags] = useState([]);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { isActive: true },
  });

  const isActive = watch("isActive");

  async function onSubmit(data) {
    data.farmerId = farmerId;
    data.productImages = productImages;
    data.tags = tags;

    makePostRequest(
      setLoading,
      "/api/products",
      data,
      "Product",
      reset
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Stock Quantity" name="productStock" type="number" register={register} errors={errors} />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
        <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
        <TextInput label="Wholesale Quantity" name="wholesaleQty" type="number" register={register} errors={errors} />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} />
        <TextareaInput label="Description" name="description" register={register} errors={errors} />
        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
        <ImageInput imageUrl={productImages[0] || ""} setImageUrl={(url) => setProductImages([url])} endpoint="productUploader" label="Main Image" />
        <ToggleInput label="Active" name="isActive" register={register} trueTitle="Yes" falseTitle="No" />
      </div>

      <SubmitButton isLoading={loading} buttonTitle="Upload Product" loadingButtonTitle="Uploading..." />
    </form>
  );
}

