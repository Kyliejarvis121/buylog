import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, vendor: true },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}

// POST create a product
export async function POST(request) {
  try {
    const { title, description, price, categoryId, vendorId, imageUrl, stock } = await request.json();
    if (!title || !price || !categoryId) {
      return NextResponse.json({ data: null, message: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: { title, description, price: Number(price), categoryId, vendorId, imageUrl, stock: Number(stock ?? 0) },
    });

    return NextResponse.json({ data: newProduct, message: "Product created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create product", error: error.message }, { status: 500 });
  }
}
