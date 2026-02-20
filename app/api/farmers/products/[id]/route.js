// route.js - Farmer Product API
// Author: Darlington Itota

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* =====================================================
   DELETE PRODUCT (Farmer Only)
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get farmer linked to logged in user
    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );
    }

    // Verify product belongs to farmer
    const product = await prisma.product.findFirst({
      where: { id, farmerId: farmer.id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    // 🔥 Use transaction to safely delete related chats first
    await prisma.$transaction([
      prisma.chat.deleteMany({
        where: { productId: id },
      }),
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Product and related chats deleted successfully",
    });
  } catch (error) {
    console.error("❌ FARMER PRODUCT DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
