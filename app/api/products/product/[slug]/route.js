import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        productImages: true,
        user: true, // farmer/vendor
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          sku: product.sku,
          productPrice: product.productPrice,
          salePrice: product.salePrice,
          productStock: product.productStock,
          categoryId: product.categoryId,
          imageUrl: product.imageUrl,
          productImages: product.productImages,
          category: product.category,
          vendor: product.user,
          createdAt: product.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product details error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load product details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
