// app/api/farmers/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE FARMER
export async function POST(req) {
  try {
    const {
      code,
      name,
      email,
      phone,
      physicalAddress,
      landSize,
      mainCrop,
      userId
    } = await req.json();

    // Validation
    if (!code || !name || !userId) {
      return NextResponse.json(
        { success: false, message: "code, name and userId are required" },
        { status: 400 }
      );
    }

    const farmer = await prisma.farmer.create({
      data: {
        code,
        name,
        email,
        phone,
        physicalAddress,
        landSize: landSize ? Number(landSize) : null,
        mainCrop,
        userId
      }
    });

    return NextResponse.json({
      success: true,
      message: "Farmer created successfully",
      data: farmer
    });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating farmer" },
      { status: 500 }
    );
  }
}

// GET ALL FARMERS
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true
      }
    });

    return NextResponse.json({
      success: true,
      data: farmers
    });
  } catch (error) {
    console.error("FETCH FARMERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching farmers" },
      { status: 500 }
    );
  }
}
