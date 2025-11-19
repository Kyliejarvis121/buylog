import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const farmerData = await request.json();

    // Check if the user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: farmerData.userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "No User Found" },
        { status: 404 }
      );
    }

    // Update emailVerified (if field exists, otherwise skip)
    const updatedUser = await prisma.users.update({
      where: { id: farmerData.userId },
      data: { isVerified: true }, // matches your schema
    });

    // Create farmer profile (ensure 'farmerProfile' model exists in schema)
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
        isActive: farmerData.isActive,
        products: farmerData.products,
        landSize: parseFloat(farmerData.landSize),
        mainCrop: farmerData.mainCrop,
        userId: farmerData.userId,
      },
    });

    return NextResponse.json(newFarmerProfile);
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json(
      { message: "Failed to create Farmer", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const farmers = await prisma.farmerProfile.findMany({
      orderBy: { createdAt: "desc" }, // ensure 'createdAt' exists in farmerProfile model
      include: { user: true }, // include user relation if exists
    });

    return NextResponse.json(farmers);
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch FARMERs", error: error.message },
      { status: 500 }
    );
  }
}
