import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET ALL PRODUCTS
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        vendor: true,
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE PRODUCT
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, price, image, categoryId, vendorId } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: price ? parseFloat(price) : null, // prevents crash
        image,
        categoryId,
        vendorId,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
