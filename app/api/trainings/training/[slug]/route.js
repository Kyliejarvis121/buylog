import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const training = await db.training.findUnique({
      where: { slug },
    });

    // If no training is found, return a safe empty object
    if (!training) {
      return NextResponse.json(
        { data: null, message: "Training not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: training });
  } catch (error) {
    console.error("TRAINING API ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to Fetch Training",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
