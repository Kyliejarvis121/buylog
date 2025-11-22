import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const farmer = await prisma.users.findUnique({
      where: { id },
      include: { farmerProfile: true }, // check your schema relation name
    });

    if (!farmer) {
      return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });
    }

    return NextResponse.json({ data: farmer, message: "Farmer fetched successfully" });
  } catch (error) {
    console.error("Failed to fetch farmer:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch farmer", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });
    }

    const deletedUser = await prisma.users.delete({ where: { id } });
    return NextResponse.json({ data: deletedUser, message: "Farmer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ data: null, message: "Failed to delete farmer", error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { emailVerified } = await request.json();

    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { emailVerified },
    });

    return NextResponse.json({ data: updatedUser, message: "Farmer updated successfully" });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ data: null, message: "Failed to update farmer", error: error.message }, { status: 500 });
  }
}
