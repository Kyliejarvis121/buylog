import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const farmerData = await request.json();

    // ✅ Check required fields
    if (!farmerData.userId || !farmerData.name) {
      return NextResponse.json(
        { data: null, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: farmerData.userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "No User Found" },
        { status: 404 }
      );
    }

    // Update user verification
    await prisma.users.update({
      where: { id: farmerData.userId },
      data: { emailVerified: true }, // change 'isVerified' → 'emailVerified' if matches schema
    });

    // Create farmer profile
    const newFarmerProfile = await prisma.farmerProfile.create({
      data: {
        code: farmerData.code,
        contactPerson: farmerData.contactPerson,
        contactPersonPhone: farmerData.contactPersonPhone,
        profileImageUrl: farmerData.profileImageUrl,
        email: farmerData.email,
        name: farmerData.name,
        notes: farmerData.notes,
        phone: farmerData.phone,
        physicalAddress: farmerData.physicalAddress,
        terms: farmerData.terms,
        isActive: farmerData.isActive ?? true,
        products: farmerData.products || [],
        landSize: farmerData.landSize ? parseFloat(farmerData.landSize) : 0,
        mainCrop: farmerData.mainCrop,
        userId: farmerData.userId,
      },
    });

    return NextResponse.json({
      data: newFarmerProfile,
      message: "Farmer profile created successfully",
    });
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create Farmer", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const farmers = await prisma.farmerProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }, // only if 'user' relation exists in schema
    });

    return NextResponse.json({
      data: farmers,
      message: "Farmers fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch Farmers", error: error.message },
      { status: 500 }
    );
  }
}
