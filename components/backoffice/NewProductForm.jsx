"use client";

import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

export default function NewProductForm({ categories, farmers, updateData = {} }) {
  const [imageUrl, setImageUrl] = useState(updateData?.imageUrl || "");
  const [productImages, setProductImages] = useState(updateData?.productImages || []);
  const [tags, setTags] = useState(updateData?.tags || []);
  const [loading, setLoading] = useState(false);
  const id = updateData?.id || "";
  const router = useRouter();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      isActive: true,
      isWholesale: false,
      ...updateData,
    },
  });

  const isActive = watch("isActive");
  const isWholesale = watch("isWholesale");

  function redirect() {
    router.push("/dashboard/products");
  }

  async function onSubmit(data) {
    const slug = generateSlug(data.title);
    const productCode = generateUserCode("LLP", data.title);

    const payload = {
      title: data.title,
      slug,
      price: Number(data.productPrice),
      description: data.description || "",
      categoryId: data.categoryId || null,
      farmerId: data.farmerId || null,
      imageUrl: imageUrl || productImages[0] || "",
      productImages,
      isActive: isActive ?? true,
      tags,
      productCode,
      // Optional wholesale fields
      wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : null,
      wholesaleQty: data.wholesaleQty ? Number(data.wholesaleQty) : null,
    };

    if (id) {
      // Update existing product
      payload.id = id;
      makePutRequest(setLoading, `api/products/${id}`, payload, "Product", redirect);
    } else {
      // Create new product
      makePostRequest(setLoading, "api/products", payload, "Product", reset, redirect);
      setProductImages([]);
      setTags([]);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white border rounded-lg shadow mx-auto my-3">
      <TextInput label="Product Title" name="title" register={register} errors={errors} />
      <TextInput label="Product Price" name="productPrice" type="number" register={register} errors={errors} />
      <SelectInput label="Select Category" name="categoryId" register={register} errors={errors} options={categories} />
      <SelectInput label="Select Farmer" name="farmerId" register={register} errors={errors} options={farmers} />
      <MultipleImageInput imageUrls={productImages} setImageUrls={setProductImages} endpoint="multipleProductsUploader" label="Product Images" />
      <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />
      <TextareaInput label="Product Description" name="description" register={register} errors={errors} />
      <ToggleInput label="Publish Product" name="isActive" trueTitle="Active" falseTitle="Draft" register={register} />
      <SubmitButton isLoading={loading} buttonTitle={id ? "Update Product" : "Create Product"} loadingButtonTitle={id ? "Updating Product..." : "Creating Product..."} />
    </form>
  );
}

