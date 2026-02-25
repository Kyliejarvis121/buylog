"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";

import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { makeRequest, makePutRequest } from "@/lib/apiRequest";

export default function ProductUpload({
  farmerId,
  categories = [],
  existingProduct = null,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(existingProduct?.tags || []);
  const [productImages, setProductImages] = useState(
    existingProduct?.productImages || []
  );

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: existingProduct?.title || "",
      description: existingProduct?.description || "",
      productPrice: existingProduct?.price || 0,
      salePrice: existingProduct?.salePrice || 0,
      productStock: existingProduct?.productStock || 0,
      categoryId: existingProduct?.categoryId || "",
      isActive: existingProduct?.isActive ?? true,
      isWholesale: existingProduct?.isWholesale ?? false,
      wholesalePrice: existingProduct?.wholesalePrice || 0,
      wholesaleQty: existingProduct?.wholesaleQty || 0,
      phoneNumber: existingProduct?.phoneNumber || "",
      location: existingProduct?.location || "",
    },
  });

  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (productImages.length < 1) {
      toast.error("Upload at least one product image");
      return;
    }

    const allImages = productImages;

    const payload = {
      title: data.title,
      description: data.description || "",
      slug: generateSlug(data.title),

      price: Number(data.productPrice) || 0,
      salePrice: Number(data.salePrice) || 0,
      productStock: Number(data.productStock) || 0,

      categoryId: data.categoryId || null,
      farmerId,

      imageUrl: allImages[0],
      productImages: allImages,
      tags,

      productCode: generateUserCode("LLP", data.title),

      isWholesale: Boolean(data.isWholesale),
      wholesalePrice: Number(data.wholesalePrice) || 0,
      wholesaleQty: Number(data.wholesaleQty) || 0,

      isActive: Boolean(data.isActive),
      qty: 1,

      phoneNumber: data.phoneNumber || "",
      location: data.location || "",
    };

    const endpoint = existingProduct
      ? `/api/farmers/products/${existingProduct.id}`
      : "/api/products";

    try {
      if (existingProduct) {
        await makePutRequest(
          setLoading,
          endpoint,
          payload,
          "Product",
          () => router.push("/dashboard/farmers/products"),
          () => {
            reset();
            setTags([]);
            setProductImages([]);
          }
        );
      } else {
        await makeRequest(
          setLoading,
          endpoint,
          payload,
          "Product uploaded successfully",
          () => {
            reset();
            setTags([]);
            setProductImages([]);
          },
          () => router.push("/dashboard/farmers/products"),
          "POST"
        );
      }
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      toast.error("Something went wrong");
    }
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
        <TextInput
          label="Product Title"
          name="title"
          register={register}
          errors={errors}
          defaultValue={existingProduct?.title}
        />

        <TextInput
          label="Product Price"
          name="productPrice"
          type="number"
          register={register}
          errors={errors}
          defaultValue={existingProduct?.price}
        />

        <TextInput
          label="Discount Price"
          name="salePrice"
          type="number"
          register={register}
          errors={errors}
          defaultValue={existingProduct?.salePrice}
        />

        <TextInput
          label="Product Stock"
          name="productStock"
          type="number"
          register={register}
          errors={errors}
          defaultValue={existingProduct?.productStock}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Category</label>
          <select
            {...register("categoryId")}
            className="border rounded-md px-3 py-2 text-sm bg-gray-800 text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

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
          existingImages={existingProduct?.productImages || []}
        />

        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />

        <TextareaInput
          label="Product Description"
          name="description"
          register={register}
          errors={errors}
          defaultValue={existingProduct?.description}
        />

        <TextInput
          label="Contact Number"
          name="phoneNumber"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Location"
          name="location"
          placeholder="e.g. Benin City"
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
        buttonTitle={existingProduct ? "Update Product" : "Add Product"}
        loadingButtonTitle={
          existingProduct ? "Updating Product..." : "Uploading Product..."
        }
      />
    </form>
  );
}