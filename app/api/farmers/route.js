import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// POST /api/farmers
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "You must be logged in" }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await req.json();

    // Required fields check
    if (!data.name || !data.phone) {
      return NextResponse.json({ success: false, message: "Name and phone are required" }, { status: 400 });
    }

    const farmer = await prisma.farmer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        physicalAddress: data.physicalAddress || null,
        contactPerson: data.contactPerson || null,
        contactPersonPhone: data.contactPersonPhone || null,
        landSize: data.landSize ? Number(data.landSize) : 0,
        mainCrop: data.mainCrop || null,
        products: data.products || [],
        profileImageUrl: data.profileImageUrl || "",
        terms: data.terms || null,
        notes: data.notes || null,
        isActive: data.isActive ?? true,
        code: data.code || null,
        userId,
      },
    });

    return NextResponse.json({ success: true, data: farmer, message: "Farmer created successfully" }, { status: 201 });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error creating farmer", error: error.message }, { status: 500 });
  }
}
