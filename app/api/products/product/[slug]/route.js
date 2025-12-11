import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        farmer: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("PRODUCT GET ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
