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
      () => router.push("/back-office/dashboard/farmers/products")
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-6 bg-gray-800 border border-gray-700 rounded-lg shadow mx-auto my-4"
    >
      <h2 className="text-xl font-semibold mb-4">Upload New Product</h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Product Title"
          name="title"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Product SKU"
          name="sku"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Product Barcode"
          name="barcode"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Product Price"
          name="productPrice"
          register={register}
          errors={errors}
          type="number"
        />
        <TextInput
          label="Discounted Price"
          name="salePrice"
          register={register}
          errors={errors}
          type="number"
        />
        <TextInput
          label="Product Stock"
          name="productStock"
          type="number"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Unit (e.g. KG, Bags)"
          name="unit"
          register={register}
          errors={errors}
        />
        <SelectInput
          label="Select Category"
          name="categoryId"
          register={register}
          errors={errors}
          options={categories} // use the passed prop
        />
        <ToggleInput
          label="Supports Wholesale"
          name="isWholesale"
          trueTitle="Enabled"
          falseTitle="Disabled"
          register={register}
        />
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
        <MultipleImageInput
          imageUrls={productImages}
          setImageUrls={setProductImages}
          endpoint="multipleProductsUploader"
          label="Product Images"
        />
        <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />
        <TextareaInput
          label="Product Description"
          name="description"
          register={register}
          errors={errors}
        />
        <ToggleInput
          label="Publish Product"
          name="isActive"
          trueTitle="Active"
          falseTitle="Draft"
          register={register}
        />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle="Add Product"
        loadingButtonTitle="Uploading Product..."
      />
    </form>
  );
}
