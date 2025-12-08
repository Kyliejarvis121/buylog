"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { UploadButton } from "@uploadthing/react";
import { ourFileRouter } from "@/utils/uploadthing";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId, categories = [] }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      salePrice: "",
      isActive: true,
      isWholesale: false,
      wholesalePrice: "",
      wholesaleQty: "",
      productStock: 0,
      qty: 0,
      productCode: "",
      categoryId: categories[0]?.id || "",
    },
  });

  const isActive = watch("isActive");
  const isWholesale = watch("isWholesale");

  const onSubmit = async (data) => {
    if (!imageUrl) {
      alert("Please upload a main product image first.");
      return;
    }

    data.imageUrl = imageUrl;
    data.productImages = productImages;
    data.tags = tags;
    data.farmerId = farmerId;

    await makePostRequest(
      setLoading,
      "/api/products",
      data,
      "Product Created",
      reset,
      () => router.refresh()
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Product Details */}
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Product Stock" name="productStock" type="number" register={register} errors={errors} />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} />

        <select {...register("categoryId")} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>

        <TextareaInput label="Description" name="description" register={register} errors={errors} />

        <ToggleInput label="Active" name="isActive" register={register} trueTitle="Active" falseTitle="Inactive" />
        <ToggleInput label="Is Wholesale" name="isWholesale" register={register} trueTitle="Yes" falseTitle="No" />

        {isWholesale && (
          <>
            <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
            <TextInput label="Wholesale Quantity" name="wholesaleQty" type="number" register={register} errors={errors} />
          </>
        )}

        {/* Tags */}
        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />

        {/* Product Images */}
        <ArrayItemsInput items={productImages} setItems={setProductImages} itemTitle="Product Image URL" />

        {/* UploadThing Button */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Product Image</label>
          <UploadButton
            endpoint="productImageUploader" // must match your UploadThing router
            onClientUploadComplete={(res) => {
              if (res && res[0]?.fileUrl) setImageUrl(res[0].fileUrl);
            }}
            onUploadError={(err) => {
              console.error(err);
              alert("Upload failed. See console for details.");
            }}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded Product" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton
        isLoading={loading}
        buttonTitle="Add Product"
        loadingButtonTitle="Creating Product..."
      />
    </form>
  );
}
