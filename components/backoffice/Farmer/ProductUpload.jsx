"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// UI Components
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";

import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId, categories }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      isWholesale: false,
    },
  });

  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (productImages.length === 0)
      return alert("Upload at least one product image");

    const slug = generateSlug(data.title);
    const productCode = generateUserCode("LLP", data.title);

    const payload = {
      title: data.title,
      slug,
      description: data.description,
      price: parseFloat(data.productPrice),          // ✅ Prisma price field
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      categoryId: data.categoryId || null,
      farmerId,
      imageUrl: productImages[0] || "",
      productImages: productImages || [],
      tags: tags || [],
      isActive: data.isActive ?? true,
      isWholesale: data.isWholesale ?? false,
      wholesalePrice: data.wholesalePrice
        ? parseFloat(data.wholesalePrice)
        : null,
      wholesaleQty: data.wholesaleQty ? parseInt(data.wholesaleQty) : null,
      productStock: data.productStock ? parseInt(data.productStock) : 0,
      qty: 1,
      productCode,
      sku: data.sku || "",
      barcode: data.barcode || "",
      unit: data.unit || "",
    };

    console.log("Submitting payload:", payload);

    makePostRequest(
      setLoading,
      "/api/products",
      payload,
      "Product",
      () => {
        reset();
        setTags([]);
        setProductImages([]);
      },
      () => router.push("/back-office/dashboard/farmers/products") // ✅ Correct redirect
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-4"
    >
      <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="SKU" name="sku" register={register} errors={errors} />
        <TextInput label="Barcode" name="barcode" register={register} errors={errors} />
        <TextInput label="Price" name="productPrice" register={register} errors={errors} type="number" />
        <TextInput label="Discounted Price" name="salePrice" register={register} errors={errors} type="number" />
        <TextInput label="Stock" name="productStock" register={register} errors={errors} type="number" />
        <TextInput label="Unit" name="unit" register={register} errors={errors} />
        <SelectInput label="Category" name="categoryId" register={register} errors={errors} options={categories} />
        <ToggleInput label="Supports Wholesale" name="isWholesale" trueTitle="Enabled" falseTitle="Disabled" register={register} />

        {isWholesale && (
          <>
            <TextInput label="Wholesale Price" name="wholesalePrice" register={register} errors={errors} type="number" />
            <TextInput label="Minimum Wholesale Qty" name="wholesaleQty" register={register} errors={errors} type="number" />
          </>
        )}

        <MultipleImageInput imageUrls={productImages} setImageUrls={setProductImages} endpoint="multipleProductsUploader" label="Product Images" />
        <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />
        <TextareaInput label="Description" name="description" register={register} errors={errors} />
        <ToggleInput label="Publish Product" name="isActive" trueTitle="Active" falseTitle="Draft" register={register} />
      </div>

      <SubmitButton isLoading={loading} buttonTitle="Add Product" loadingButtonTitle="Uploading Product..." />
    </form>
  );
}
