"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductUpload from "@/components/Farmer/ProductUpload";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(`/api/farmers/products/${productId}`),
          fetch("/api/categories"),
        ]);

        const productJson = await productRes.json();
        const categoryJson = await categoryRes.json();

        if (!productJson?.success || !productJson?.data) {
          alert("Product not found");
          router.push("/dashboard/farmers/products");
          return;
        }

        setProduct(productJson.data);
        setCategories(categoryJson?.data || []);
      } catch (error) {
        console.error(error);
        alert("Failed to load product");
        router.push("/dashboard/farmers/products");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchData();
  }, [productId, router]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <ProductUpload
      farmerId={product?.farmerId}
      categories={categories}
      existingProduct={product}
    />
  );
}