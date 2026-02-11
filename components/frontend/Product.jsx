"use client";

import { addToCart } from "@/redux/slices/cartSlice";
import { BaggageClaim } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function Product({ product }) {
  const dispatch = useDispatch();

  function handleAddToCart() {
    dispatch(addToCart(product));
    toast.success("Item added successfully");
  }

  const mainImage =
    product.productImages?.length > 0
      ? product.productImages[0]
      : product.imageUrl || "/no-image.png";

  return (
    <div className="rounded-lg bg-white dark:bg-slate-900 overflow-hidden border shadow-sm">
      {/* IMAGE */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-sm font-medium text-center line-clamp-2 text-slate-800 dark:text-slate-200">
            {product.title}
          </h2>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            UGX {product.salePrice ?? product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-lime-600 hover:bg-lime-700 px-3 py-1.5 rounded-md text-white text-sm"
          >
            <BaggageClaim size={16} />
            <span>Add</span>
          </button>
        </div>

        {/* ✅ Seller Phone Number */}
        {product.phoneNumber && (
          <p className="mt-2 text-xs text-center text-slate-700 dark:text-slate-300">
            📞 Seller: {product.phoneNumber}
          </p>
        )}
      </div>
    </div>
  );
}
