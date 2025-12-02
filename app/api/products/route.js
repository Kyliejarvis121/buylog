import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.title || !data.price) {
      return NextResponse.json({ success: false, message: "Title and price are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        price: Number(data.price),
        categoryId: data.categoryId || null,
        farmerId: data.farmerId || null,
        description: data.description || "",
        imageUrl: data.imageUrl || "",
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
