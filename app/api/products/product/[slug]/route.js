import { prisma } from "@/lib/prismadb"; // Use prisma client
import { NextResponse } from "next/server";

// GET product by slug
export async function GET(request, { params: { slug } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, farmer: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product", error },
      { status: 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(request, { params: { id } }) {
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error },
      { status: 500 }
    );
  }
}

// UPDATE product by ID
export async function PUT(request, { params: { id } }) {
  try {
    const data = await request.json();

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Parse numeric fields safely
    const numericFields = ["productPrice", "salePrice", "wholesalePrice", "wholesaleQty", "productStock", "qty"];
    numericFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        if (field.includes("Qty") || field === "productStock" || field === "qty") {
          data[field] = parseInt(data[field]);
        } else {
          data[field] = parseFloat(data[field]);
        }
      }
    });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        farmerId: data.farmerId || null,
        categoryId: data.categoryId || null,
        productImages: data.productImages || [],
        tags: data.tags || [],
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error },
      { status: 500 }
    );
  }
}
