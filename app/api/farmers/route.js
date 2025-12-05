import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET all farmers
export async function GET(req) {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // include user info if needed
        supports: true, // include any support tickets
      },
    });

    // Map farmers to a frontend-friendly format (similar to products)
    const mappedFarmers = farmers.map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      code: f.code,
      mainCrop: f.mainCrop,
      landSize: f.landSize,
      status: f.status,
      isActive: f.isActive,
      products: f.products, // array of product image URLs
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      userId: f.userId,
      user: f.user ? { id: f.user.id, name: f.user.name, email: f.user.email } : null,
    }));

    return NextResponse.json({
      success: true,
      data: mappedFarmers,
    });
  } catch (error) {
    console.error("FETCH FARMERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching farmers", error: error.message },
      { status: 500 }
    );
  }
}
