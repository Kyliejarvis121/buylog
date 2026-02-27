import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await prisma.product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "All products deleted"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}