// Route: app/api/farmers/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all farmers
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });
    return NextResponse.json({ data: farmers, message: "Farmers fetched successfully" });
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json({ data: [], message: "Failed to fetch farmers", error: error.message }, { status: 500 });
  }
}

// POST create farmer
export async function POST(request) {
  try {
    const data = await request.json();
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });

    const farmer = await prisma.farmer.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        physicalAddress: data.physicalAddress,
        isActive: false,
        status: "pending",
        products: data.products ?? [],
        landSize: Number(data.landSize) || 0,
        mainCrop: data.mainCrop ?? "",
        userId: data.userId,
      },
    });

    return NextResponse.json({ data: farmer, message: "Farmer registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json({ data: null, message: "Failed to register farmer", error: error.message }, { status: 500 });
  }
}
