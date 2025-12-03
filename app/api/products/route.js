import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      price,
      description,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      isActive,
      tags,
      productCode,
    } = body;

    // Validate required fields
    if (!title || !price || !productImages || !Array.isArray(productImages)) {
      return NextResponse.json(
        { data: null, message: "Title, price, and productImages are required" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        price: Number(price),
        description: description || "",
        categoryId: categoryId || null,
        farmerId: farmerId || null,
        imageUrl: imageUrl || productImages[0] || "",
        productImages,
        isActive: isActive ?? true,
        tags: tags || [],
        productCode: productCode || "",
      },
    });

    return NextResponse.json(
      { data: newProduct, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
