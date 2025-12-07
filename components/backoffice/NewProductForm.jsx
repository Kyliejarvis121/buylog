"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextAreaInput";
import ToggleInput from "../FormInputs/ToggleInput";
import SubmitButton from "../FormInputs/SubmitButton";
import ImageInput from "../FormInputs/ImageInput";
import ArrayItemsInput from "../FormInputs/ArrayItemsInput";
import { makePostRequest } from "@/lib/apiRequest";
import { generateSlug } from "@/lib/generateSlug";

export default function NewProductForm({ categories }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [tags, setTags] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { isActive: true },
  });

  const onSubmit = async (data) => {
    data.slug = generateSlug(data.title);
    data.productImages = productImages;
    data.imageUrl = imageUrl;
    data.tags = tags;

    makePostRequest(
      setLoading,
      "/api/products",
      data,
      "Product",
      reset
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow-md">
      <TextInput label="Title" name="title" register={register} errors={errors} />
      <TextInput label="Price" name="price" type="number" register={register} errors={errors} />
      <TextInput label="Sale Price" name="salePrice" type="number" register={register} errors={errors} />
      <TextareaInput label="Description" name="description" register={register} errors={errors} />
      
      <select {...register("categoryId")}>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.title}</option>
        ))}
      </select>

      <ArrayItemsInput items={productImages} setItems={setProductImages} itemTitle="Product Image URL" />
      <ArrayItemsInput items={tags} setItems={setTags} itemTitle="Tag" />
      <ToggleInput label="Active" name="isActive" register={register} />

      <SubmitButton isLoading={loading} buttonTitle="Upload Product" loadingButtonTitle="Uploading..." />
    </form>
  );
}
