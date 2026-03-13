import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(request, { params: { id } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        name: true,
        id: true,
        role: true,
        createdAt: true,
        // profile: true, // only if your User model has a relation named 'profile'
      },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
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
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedUser });
  } catch (error) {
    console.error("Failed to Delete User:", error);
    return NextResponse.json(
      { message: "Failed to Delete User", error: error.message },
      { status: 500 }
    );
  }
}
