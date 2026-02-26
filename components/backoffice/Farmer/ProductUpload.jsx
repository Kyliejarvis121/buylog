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
      title: existingProduct?.title ?? "",
      description: existingProduct?.description ?? "",
      productPrice: existingProduct?.price ?? 0,
      salePrice: existingProduct?.salePrice ?? 0,
      productStock: existingProduct?.productStock ?? 0,
      categoryId: existingProduct?.categoryId ?? "",
      isActive: existingProduct?.isActive ?? true,
      isWholesale: existingProduct?.isWholesale ?? false,
      wholesalePrice: existingProduct?.wholesalePrice ?? 0,
      wholesaleQty: existingProduct?.wholesaleQty ?? 0,
      phoneNumber: existingProduct?.phoneNumber ?? "",
      location: existingProduct?.location ?? "",
    },
  });

  const isWholesale = watch("isWholesale");

  /* =============================
     SUBMIT HANDLER
  ============================== */
  const onSubmit = async (formData) => {
    if (!productImages.length) {
      toast.error("Upload at least one product image");
      return;
    }

    const mergedImages = existingProduct
      ? [...new Set([...productImages])]
      : productImages;

    const productId = existingProduct?.id || existingProduct?._id;

    const payload = {
      id: productId,
      title: formData.title,
      description: formData.description,
      slug: generateSlug(formData.title),

      price: Number(formData.productPrice),
      salePrice: Number(formData.salePrice),
      productStock: Number(formData.productStock),

      categoryId: formData.categoryId || null,
      farmerId,

      imageUrl: mergedImages[0],
      productImages: mergedImages,
      tags,

      productCode: generateUserCode("LLP", formData.title),

      isWholesale: Boolean(formData.isWholesale),
      wholesalePrice: Number(formData.wholesalePrice) || 0,
      wholesaleQty: Number(formData.wholesaleQty) || 0,

      isActive: Boolean(formData.isActive),
      qty: 1,

      phoneNumber: formData.phoneNumber,
      location: formData.location,
    };

    const endpoint = productId
      ? `/api/farmers/products/${productId}`
      : "/api/products";

    const method = productId ? "PUT" : "POST";

    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success(
        existingProduct
          ? "Product updated successfully"
          : "Product uploaded successfully"
      );

      if (!existingProduct) {
        reset();
        setTags([]);
        setProductImages([]);
      }

      router.push("/dashboard/farmers/products");
    } catch (error) {
      console.error("PRODUCT SUBMIT ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     UI
  ============================== */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-6 mx-auto my-6 bg-gray-900 border border-gray-700 rounded-lg shadow text-white"
    >
      <h2 className="text-xl font-semibold mb-6">
        {existingProduct ? "Edit Product" : "Upload New Product"}
      </h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

        {/* CATEGORY */}
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

        {/* WHOLESALE TOGGLE */}
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

        {/* IMAGES */}
        <MultipleImageInput
          imageUrls={productImages}
          setImageUrls={setProductImages}
          endpoint="multipleProductsUploader"
          label="Upload Product Images"
        />

        {/* TAGS */}
        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />

        <TextareaInput
          label="Product Description"
          name="description"
          register={register}
          errors={errors}
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