// app/api/farmers/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE FARMER
export async function POST(req) {
  try {
    const data = await req.json();
    console.log("FARMER POST DATA:", data); // debug log

    const {
      code,
      name,
      email,
      phone,
      physicalAddress,
      userId,        // REQUIRED: must match a user in your DB
      landSize,
      mainCrop,
      isActive
    } = data;

    // ===== VALIDATION =====
    if (!code || !name || !userId) {
      return NextResponse.json(
        { success: false, message: "code, name, and userId are required" },
        { status: 400 }
      );
    }

    // CHECK IF USER EXISTS
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // CREATE FARMER
    const farmer = await prisma.farmer.create({
      data: {
        code,
        name,
        email: email ?? null,
        phone: phone ?? null,
        physicalAddress: physicalAddress ?? null,
        userId,
        landSize: landSize ? Number(landSize) : null,
        mainCrop: mainCrop ?? null,
        isActive: Boolean(isActive),
        products: [], // default empty array
      },
    });

    return NextResponse.json({
      success: true,
      message: "Farmer created successfully",
      data: farmer
    });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating farmer", error: error.message },
      { status: 500 }
    );
  }
}

// GET ALL FARMERS
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, supports: true }, // include relations if needed
    });

    return NextResponse.json({ success: true, data: farmers });
  } catch (error) {
    console.error("FETCH FARMERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching farmers" },
      { status: 500 }
    );
  }
}
