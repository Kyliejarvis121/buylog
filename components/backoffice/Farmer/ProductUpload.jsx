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
    defaultValues: { isActive: true, isWholesale: false },
  });

  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (productImages.length < 1) {
      return alert("Upload at least one product image");
    }

    const slug = generateSlug(data.title);
    const productCode = generateUserCode("LLP", data.title);

    const payload = {
      title: data.title,
      description: data.description ?? "",
      slug,
      price: parseFloat(data.productPrice),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : 0,
      productStock: parseInt(data.productStock ?? 0),
      categoryId: data.categoryId || null,
      farmerId,
      imageUrl: productImages[0], // main image
      productImages, // array
      tags,
      productCode,
      isWholesale: !!data.isWholesale,
      wholesalePrice: data.wholesalePrice
        ? parseFloat(data.wholesalePrice)
        : 0,
      wholesaleQty: data.wholesaleQty ? parseInt(data.wholesaleQty) : 0,
      isActive: !!data.isActive,
      qty: 1,
    };

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
      () => router.push("/dashboard/farmers/products")
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-gray-900 border border-gray-700 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-4 text-white"
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
          label="Product Price"
          name="productPrice"
          type="number"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Discount Price"
          name="salePrice"
          type="number"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Product Stock"
          name="productStock"
          type="number"
          register={register}
          errors={errors}
        />

        <SelectInput
          label="Select Category"
          name="categoryId"
          register={register}
          errors={errors}
          options={categories.map((c) => ({
            value: c.id,
            label: c.title,
          }))}
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
              type="number"
              register={register}
              errors={errors}
            />

            <TextInput
              label="Minimum Wholesale Qty"
              name="wholesaleQty"
              type="number"
              register={register}
              errors={errors}
            />
          </>
        )}

        <MultipleImageInput
          imageUrls={productImages}
          setImageUrls={setProductImages}
          endpoint="multipleProductsUploader"
          label="Upload Product Images"
        />

        <ArrayItemsInput
          setItems={setTags}
          items={tags}
          itemTitle="Tag"
        />

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
