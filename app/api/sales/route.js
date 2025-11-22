import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = session.user.role;
    const userId = session.user.id;

    let sales;

    // If ADMIN → get all sales
    if (role === "ADMIN") {
      sales = await db.sales.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: true,         // customer
          product: true,      // product
        },
      });
    }

    // If FARMER → get only their own sales
    if (role === "FARMER") {
      sales = await db.sales.findMany({
        where: {
          vendorId: userId,
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          product: true,
        },
      });
    }

    return NextResponse.json(sales);
  } catch (error) {
    console.error("SALES API ERROR:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch sales",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

