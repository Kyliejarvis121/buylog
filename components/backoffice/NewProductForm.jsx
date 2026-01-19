"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ImageInput from "@/components/FormInputs/ImageInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { makePostRequest } from "@/lib/apiRequest";

export default function NewProductForm({ categories = [], farmers = [], updateData = null }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(updateData?.imageUrl || "");
  const [productImages, setProductImages] = useState(updateData?.productImages || []);
  const [tags, setTags] = useState(updateData?.tags || []);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: updateData?.title || "",
      slug: updateData?.slug || "",
      description: updateData?.description || "",
      price: updateData?.price || "",
      salePrice: updateData?.salePrice || "",
      isActive: updateData?.isActive ?? true,
      isWholesale: updateData?.isWholesale ?? false,
      wholesalePrice: updateData?.wholesalePrice || "",
      wholesaleQty: updateData?.wholesaleQty || "",
      productStock: updateData?.productStock || 0,
      qty: updateData?.qty || 0,
      productCode: updateData?.productCode || "",
      categoryId: updateData?.categoryId || (categories[0]?.id || ""),
      farmerId: updateData?.farmerId || (farmers[0]?.id || ""),
    },
  });

  const isActive = watch("isActive");
  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    data.price = parseFloat(data.price);
    data.salePrice = data.salePrice ? parseFloat(data.salePrice) : null;

    data.imageUrl = imageUrl;
    data.productImages = productImages;
    data.tags = tags;

    const endpoint = updateData ? `products/${updateData.id}` : "products";

    await makePostRequest(
      setLoading,
      `/api/${endpoint}`,
      data,
      updateData ? "Product Updated" : "Product Created",
      reset,
      () => router.push("/dashboard/products")
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Basic Product Fields */}
        <TextInput label="Product Title" name="title" register={register} errors={errors} className="w-full" />
        <TextInput label="Slug" name="slug" register={register} errors={errors} className="w-full" />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} className="w-full" />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} className="w-full" />
        <TextInput label="Product Stock" name="productStock" type="number" register={register} errors={errors} className="w-full" />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} className="w-full" />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} className="w-full" />

        {/* Select Fields */}
        <select {...register("categoryId")} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>

        <select {...register("farmerId")} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
          {farmers.map((farmer) => (
            <option key={farmer.id} value={farmer.id}>{farmer.title}</option>
          ))}
        </select>

        {/* Description */}
        <div className="col-span-1 sm:col-span-2">
          <TextareaInput label="Description" name="description" register={register} errors={errors} className="w-full" />
        </div>

        {/* Toggles */}
        <ToggleInput label="Active" name="isActive" register={register} trueTitle="Active" falseTitle="Inactive" />
        <ToggleInput label="Is Wholesale" name="isWholesale" register={register} trueTitle="Yes" falseTitle="No" />

        {/* Wholesale Fields */}
        {isWholesale && (
          <>
            <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} className="w-full" />
            <TextInput label="Wholesale Quantity" name="wholesaleQty" type="number" register={register} errors={errors} className="w-full" />
          </>
        )}

        {/* Tags & Images */}
        <div className="col-span-1 sm:col-span-2">
          <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <ArrayItemsInput items={productImages} setItems={setProductImages} itemTitle="Product Image URL" />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <ImageInput imageUrl={imageUrl} setImageUrl={setImageUrl} endpoint="productUploader" label="Main Product Image" />
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton
        isLoading={loading}
        buttonTitle={updateData ? "Update Product" : "Add Product"}
        loadingButtonTitle={updateData ? "Updating Product..." : "Creating Product..."}
      />
    </form>
  );
}
