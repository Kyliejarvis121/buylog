import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const farmer = await prisma.user.findUnique({
      where: { id },
      include: { farmerProfile: true },
    });
    return NextResponse.json(farmer);
  } catch (error) {
    console.error("Failed to fetch farmer:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Farmer", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    const deletedUser = await prisma.user.delete({ where: { id } });
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { message: "Failed to Delete User", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { status, emailVerified } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status, emailVerified },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { message: "Failed to Update User", error: error.message || error },
      { status: 500 }
    );
  }
}
