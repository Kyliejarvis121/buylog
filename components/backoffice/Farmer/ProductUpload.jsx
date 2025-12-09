// components/backoffice/Farmer/ProductUpload.jsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";
import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";

export default function ProductUpload({ farmerId, categories }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { isActive: true, isWholesale: false },
  });

  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (!productImages.length) return alert("Upload at least one product image");

    const payload = {
      ...data,
      farmerId,
      slug: generateSlug(data.title),
      productCode: generateUserCode("LLP", data.title),
      tags,
      productImages,
      qty: 1,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to upload product");

      reset();
      setTags([]);
      setProductImages([]);
      router.push("/back-office/dashboard/farmers/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-6 bg-white rounded shadow mx-auto">
      <TextInput label="Product Title" name="title" register={register} errors={errors} />
      <TextInput label="SKU" name="sku" register={register} errors={errors} />
      <TextInput label="Barcode" name="barcode" register={register} errors={errors} />
      <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
      <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
      <TextInput label="Stock" name="productStock" type="number" register={register} errors={errors} />
      <TextInput label="Unit" name="unit" register={register} errors={errors} />

      {/* Category Dropdown */}
      <SelectInput label="Category" name="categoryId" register={register} errors={errors} options={categories} />

      <ToggleInput label="Supports Wholesale" name="isWholesale" trueTitle="Yes" falseTitle="No" register={register} />
      {isWholesale && (
        <>
          <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
          <TextInput label="Minimum Wholesale Qty" name="wholesaleQty" type="number" register={register} errors={errors} />
        </>
      )}

      <MultipleImageInput imageUrls={productImages} setImageUrls={setProductImages} endpoint="multipleProductsUploader" label="Product Images" />
      <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
      <TextareaInput label="Description" name="description" register={register} errors={errors} />
      <ToggleInput label="Publish Product" name="isActive" trueTitle="Active" falseTitle="Draft" register={register} />

      <SubmitButton isLoading={loading} buttonTitle="Add Product" loadingButtonTitle="Uploading..." />
    </form>
  );
}
