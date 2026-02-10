"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import ImageInput from "@/components/FormInputs/ImageInput";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";

import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId, categories = [], existingProduct = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(existingProduct?.tags || []);
  const [imageUrl, setImageUrl] = useState(existingProduct?.imageUrl || "");
  const [productImages, setProductImages] = useState(existingProduct?.productImages || []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: existingProduct?.title || "",
      slug: existingProduct?.slug || "",
      productPrice: existingProduct?.price || "",
      salePrice: existingProduct?.salePrice || "",
      productStock: existingProduct?.productStock || 0,
      qty: existingProduct?.qty || 1,
      productCode: existingProduct?.productCode || generateUserCode("LLP", existingProduct?.title || ""),
      categoryId: existingProduct?.categoryId || (categories[0]?.value || ""),
      isActive: existingProduct?.isActive ?? true,
      isWholesale: existingProduct?.isWholesale ?? false,
      wholesalePrice: existingProduct?.wholesalePrice || "",
      wholesaleQty: existingProduct?.wholesaleQty || "",
      description: existingProduct?.description || "",
    },
  });

  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (!imageUrl && productImages.length < 1) return alert("Upload at least one product image");

    const slug = generateSlug(data.title);
    const productCode = existingProduct?.productCode || generateUserCode("LLP", data.title);

    const allImages = existingProduct?.productImages
      ? [...existingProduct.productImages, ...productImages.filter(img => !existingProduct.productImages.includes(img))]
      : productImages;

    const payload = {
      id: existingProduct?.id,
      title: data.title,
      slug,
      description: data.description,
      price: parseFloat(data.productPrice),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : 0,
      productStock: parseInt(data.productStock),
      qty: parseInt(data.qty),
      productCode,
      categoryId: data.categoryId,
      farmerId,
      imageUrl: imageUrl || allImages[0],
      productImages: allImages,
      tags,
      isWholesale: !!data.isWholesale,
      wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice) : 0,
      wholesaleQty: data.wholesaleQty ? parseInt(data.wholesaleQty) : 0,
      isActive: !!data.isActive,
    };

    const method = existingProduct ? "PUT" : "POST";
    const endpoint = "/api/products";

    makePostRequest(
      setLoading,
      endpoint,
      payload,
      existingProduct ? "Product updated" : "Product uploaded",
      () => {
        reset();
        setTags([]);
        setImageUrl("");
        setProductImages([]);
      },
      () => router.push("/dashboard/farmers/products"),
      method
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-gray-900 border border-gray-700 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-4 text-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        {existingProduct ? "Edit Product" : "Upload New Product"}
      </h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Product Price" name="productPrice" type="number" register={register} errors={errors} />
        <TextInput label="Discount Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Product Stock" name="productStock" type="number" register={register} errors={errors} />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} readOnly />

        {/* Categories Dropdown fixed */}
        <select {...register("categoryId")} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <ToggleInput label="Supports Wholesale" name="isWholesale" register={register} trueTitle="Yes" falseTitle="No" />

        {isWholesale && (
          <>
            <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
            <TextInput label="Minimum Wholesale Qty" name="wholesaleQty" type="number" register={register} errors={errors} />
          </>
        )}

        <ImageInput imageUrl={imageUrl} setImageUrl={setImageUrl} endpoint="productUploader" label="Main Product Image" />
        <MultipleImageInput imageUrls={productImages} setImageUrls={setProductImages} endpoint="multipleProductsUploader" label="Upload Product Images" />

        <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />

        <TextareaInput label="Product Description" name="description" register={register} errors={errors} />

        <ToggleInput label="Publish Product" name="isActive" register={register} trueTitle="Active" falseTitle="Draft" />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle={existingProduct ? "Update Product" : "Add Product"}
        loadingButtonTitle={existingProduct ? "Updating Product..." : "Uploading Product..."}
      />
    </form>
  );
}
