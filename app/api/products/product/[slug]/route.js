import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(req, context) {
  try {
    const { slug } = context.params;
    if (!slug) return NextResponse.json({ message: "Slug is required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json({ message: "Server error fetching product", error: error.message }, { status: 500 });
  }
}
