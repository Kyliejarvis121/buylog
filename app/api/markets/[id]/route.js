import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const market = await prisma.market.findUnique({
      where: { id },
    });

    if (!market) {
      return NextResponse.json(
        { data: null, message: "Market not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: market });
  } catch (error) {
    console.error("Failed to fetch market:", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Market",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingMarket = await prisma.market.findUnique({
      where: { id },
    });

    if (!existingMarket) {
      return NextResponse.json(
        { data: null, message: "Market Not Found" },
        { status: 404 }
      );
    }

    const deletedMarket = await prisma.market.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedMarket });
  } catch (error) {
    console.error("Failed to delete market:", error);
    return NextResponse.json(
      {
        message: "Failed to Delete Market",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
