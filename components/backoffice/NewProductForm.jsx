"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import MultipleImageInput from "@/components/FormInputs/MultipleImageInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";

import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

export default function NewProductForm({ categories, farmers, updateData = {} }) {
  const [productImages, setProductImages] = useState(updateData?.productImages || []);
  const [tags, setTags] = useState(updateData?.tags || []);
  const [loading, setLoading] = useState(false);
  const id = updateData?.id || "";
  const router = useRouter();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      isActive: updateData?.isActive ?? true,
      isWholesale: updateData?.isWholesale ?? false,
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
      price: Number(data.price),                // use price
      description: data.description || "",
      categoryId: data.categoryId || null,
      farmerId: data.farmerId || null,
      imageUrl: productImages[0] || "",
      productImages,
      tags,
      isActive: isActive ?? true,
      isWholesale: isWholesale ?? false,
      productCode,
      wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : null,
      wholesaleQty: data.wholesaleQty ? Number(data.wholesaleQty) : null,
      productStock: data.productStock ? Number(data.productStock) : 0,
      qty: data.qty ? Number(data.qty) : 0,
    };

    if (id) {
      payload.id = id;
      await makePutRequest(setLoading, `api/products/${id}`, payload, "Product", redirect);
    } else {
      await makePostRequest(setLoading, "api/products", payload, "Product", reset, redirect);
      setProductImages([]);
      setTags([]);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white border rounded-lg shadow mx-auto my-3">
      <TextInput label="Product Title" name="title" register={register} errors={errors} />
      <TextInput label="Product Price" name="price" type="number" register={register} errors={errors} />
      <SelectInput label="Select Category" name="categoryId" register={register} errors={errors} options={categories} />
      <SelectInput label="Select Farmer" name="farmerId" register={register} errors={errors} options={farmers} />
      <MultipleImageInput imageUrls={productImages} setImageUrls={setProductImages} endpoint="multipleProductsUploader" label="Product Images" />
      <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag" />
      <TextareaInput label="Product Description" name="description" register={register} errors={errors} />
      <ToggleInput label="Publish Product" name="isActive" trueTitle="Active" falseTitle="Draft" register={register} />
      <ToggleInput label="Wholesale Product" name="isWholesale" trueTitle="Yes" falseTitle="No" register={register} />
      <TextInput label="Wholesale Price" name="wholesalePrice" type="number" register={register} errors={errors} />
      <TextInput label="Wholesale Quantity" name="wholesaleQty" type="number" register={register} errors={errors} />
      <TextInput label="Product Stock" name="productStock" type="number" register={register} errors={errors} />
      <TextInput label="Quantity" name="qty" type="number" register={register} errors={errors} />
      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Product" : "Create Product"}
        loadingButtonTitle={id ? "Updating Product..." : "Creating Product..."}
      />
    </form>
  );
}
