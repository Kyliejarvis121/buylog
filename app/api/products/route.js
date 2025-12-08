import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { message: "Unauthorized — only farmers can upload products" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      slug,
      price,
      salePrice,
      description,
      categoryId,
      imageUrl,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      productCode,
    } = body;

    const farmerId = session.user.id;

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        price,
        salePrice,
        description,
        imageUrl,
        productImages,
        tags,
        isActive,
        isWholesale,
        wholesalePrice,
        wholesaleQty,
        productStock,
        qty,
        productCode,

        farmer: {
          connect: { id: farmerId },
        },

        // IMPORTANT: category must use relation syntax
        category: {
          connect: { id: categoryId },
        },
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
