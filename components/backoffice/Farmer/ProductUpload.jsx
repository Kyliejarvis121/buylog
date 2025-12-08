"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// UI Components (your design system)
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

  // -------------------------------
  // 🔥 SUBMIT PRODUCT
  // -------------------------------
  const onSubmit = async (data) => {
    if (productImages.length === 0)
      return alert("Upload at least one product image");

    const slug = generateSlug(data.title);
    const productCode = generateUserCode("LLP", data.title);

    const payload = {
      ...data,
      farmerId,
      slug,
      tags,
      productImages,
      productCode,
      qty: 1,
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
      () => router.push("/dashboard/farmer/products")
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-4"
    >
      <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* TITLE */}
        <TextInput
          label="Product Title"
          name="title"
          register={register}
          errors={errors}
        />

        {/* SKU */}
        <TextInput
          label="Product SKU"
          name="sku"
          register={register}
          errors={errors}
        />

        {/* BARCODE */}
        <TextInput
          label="Product Barcode"
          name="barcode"
          register={register}
          errors={errors}
        />

        {/* PRODUCT PRICE */}
        <TextInput
          label="Product Price"
          name="productPrice"
          register={register}
          errors={errors}
          type="number"
        />

        {/* SALE PRICE */}
        <TextInput
          label="Discounted Price"
          name="salePrice"
          register={register}
          errors={errors}
          type="number"
        />

        {/* STOCK */}
        <TextInput
          label="Product Stock"
          name="productStock"
          type="number"
          register={register}
          errors={errors}
        />

        {/* UNIT */}
        <TextInput
          label="Unit (e.g. KG, Bags)"
          name="unit"
          register={register}
          errors={errors}
        />

        {/* CATEGORY SELECTION */}
        <SelectInput
          label="Select Category"
          name="categoryId"
          register={register}
          errors={errors}
          options={categories}
        />

        {/* WHOLESALE TOGGLE */}
        <ToggleInput
          label="Supports Wholesale"
          name="isWholesale"
          trueTitle="Enabled"
          falseTitle="Disabled"
          register={register}
        />

        {/* WHOLESALE BLOCK */}
        {isWholesale && (
          <>
            <TextInput
              label="Wholesale Price"
              name="wholesalePrice"
              register={register}
              errors={errors}
              type="number"
            />

            <TextInput
              label="Minimum Wholesale Qty"
              name="wholesaleQty"
              register={register}
              errors={errors}
              type="number"
            />
          </>
        )}

        {/* PRODUCT IMAGES */}
        <MultipleImageInput
          imageUrls={productImages}
          setImageUrls={setProductImages}
          endpoint="multipleProductsUploader"
          label="Product Images"
        />

        {/* TAGS */}
        <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />

        {/* DESCRIPTION */}
        <TextareaInput
          label="Product Description"
          name="description"
          register={register}
          errors={errors}
        />

        {/* IS ACTIVE */}
        <ToggleInput
          label="Publish Product"
          name="isActive"
          trueTitle="Active"
          falseTitle="Draft"
          register={register}
        />
      </div>

      {/* SUBMIT BUTTON */}
      <SubmitButton
        isLoading={loading}
        buttonTitle="Add Product"
        loadingButtonTitle="Uploading Product..."
      />
    </form>
  );
}
