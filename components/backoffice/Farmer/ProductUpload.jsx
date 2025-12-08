"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { makePostRequest } from "@/lib/apiRequest";

export default function ProductUpload({ farmerId, userId, categories = [] }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/uploadthing/${endpoint}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data?.fileUrl || data?.url || ""; // adapt based on your API response
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "productImageUploader");
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload main image");
    }
  };

  const handleMultipleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (let file of files) {
      try {
        const url = await uploadFile(file, "multipleProductsUploader");
        urls.push(url);
      } catch (err) {
        console.error(err);
      }
    }
    setProductImages([...productImages, ...urls]);
  };

  const onSubmit = async (data) => {
    if (!imageUrl) return alert("Please upload main product image");

    data.imageUrl = imageUrl;
    data.productImages = productImages;
    data.tags = tags;
    data.farmerId = farmerId; // assign farmer/vendor
    data.categoryId = data.categoryId || null;

    await makePostRequest(
      setLoading,
      `/api/products`,
      data,
      "Product Created",
      null,
      () => router.push("/dashboard/farmers/products")
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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

        <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
        <ArrayItemsInput items={productImages} setItems={setProductImages} itemTitle="Product Image URL" />

        <div>
          <label className="block mb-2 font-medium">Main Product Image</label>
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
          {imageUrl && <img src={imageUrl} alt="Main Image" className="mt-2 w-32 h-32 object-cover" />}
        </div>

        <div>
          <label className="block mb-2 font-medium">Additional Product Images</label>
          <input type="file" multiple accept="image/*" onChange={handleMultipleImagesChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {productImages.map((img, i) => (
              <img key={i} src={img} alt={`Product ${i}`} className="w-20 h-20 object-cover" />
            ))}
          </div>
        </div>
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle="Add Product"
        loadingButtonTitle="Uploading Product..."
      />
    </form>
  );
}
