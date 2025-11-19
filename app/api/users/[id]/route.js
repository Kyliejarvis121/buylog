import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton

export async function GET(request, { params: { id } }) {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        email: true,
        name: true,
        id: true,
        role: true,
        createdAt: true,
        profile: true, // make sure profile relation exists in schema
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to Fetch User:", error);
    return NextResponse.json(
      { message: "Failed to Fetch User", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    const deletedUser = await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("Failed to Delete User:", error);
    return NextResponse.json(
      { message: "Failed to Delete User", error: error.message },
      { status: 500 }
    );
  }
}
