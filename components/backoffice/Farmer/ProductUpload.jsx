"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ourFileRouter } from "@/utils/uploadthing";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ userId, categories = [] }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      salePrice: 0,
      isActive: true,
      isWholesale: false,
      wholesalePrice: 0,
      wholesaleQty: 0,
      productStock: 0,
      qty: 0,
      productCode: "",
      categoryId: categories[0]?.id || "",
    },
  });

  const isActive = watch("isActive");
  const isWholesale = watch("isWholesale");

  // File upload handler
  const handleUpload = async (file) => {
    if (!file) return;
    const uploaded = await ourFileRouter.productImageUploader.onUploadComplete({
      metadata: {},
      file,
    });
    setImageUrl(uploaded.file.url);
  };

  const handleSubmitForm = async (data) => {
    setLoading(true);
    data.imageUrl = imageUrl;
    data.productImages = productImages;
    data.tags = tags;
    data.farmerId = userId; // Assign current farmer
    data.categoryId = data.categoryId || (categories[0]?.id || null);

    try {
      await makePostRequest(
        setLoading,
        "/api/products",
        data,
        "Product Created",
        null,
        () => router.push("/dashboard/farmers/products")
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Product Title" name="title" register={register} errors={errors} />
        <TextInput label="Slug" name="slug" register={register} errors={errors} />
        <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
        <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
        <TextInput label="Product Stock" name="productStock" type="number" register={register} errors={errors} />
        <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
        <TextInput label="Product Code" name="productCode" register={register} errors={errors} />

        <select
          {...register("categoryId")}
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
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

        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
        <ArrayItemsInput items={productImages} setItems={setProductImages} itemTitle="Product Image URL" />

        <div className="col-span-full">
          <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Main Product Image</label>
          <input
            type="file"
            onChange={(e) => handleUpload(e.target.files[0])}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle="Upload Product"
        loadingButtonTitle="Uploading Product..."
      />
    </form>
  );
}
