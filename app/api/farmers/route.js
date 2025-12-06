import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// CREATE farmer
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const userId = session.user.id; // get userId from session
    const data = await req.json();

    const {
      name,
      phone,
      email,
      physicalAddress,
      contactPerson,
      contactPersonPhone,
      landSize,
      mainCrop,
      products,
      profileImageUrl,
      terms,
      notes,
      isActive,
      code,
    } = data;

    // Required validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        phone,
        email,
        physicalAddress,
        contactPerson,
        contactPersonPhone,
        landSize: Number(landSize) || 0,
        mainCrop,
        products,
        profileImageUrl,
        terms,
        notes,
        isActive: Boolean(isActive),
        code,
        userId, // linked automatically to logged-in user
      },
    });

    return NextResponse.json({
      success: true,
      data: farmer,
      message: "Farmer created successfully",
    });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating farmer", error: error.message },
      { status: 500 }
    );
  }
}
