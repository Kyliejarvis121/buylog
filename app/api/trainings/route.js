import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, categoryId, imageUrl, description, isActive, content } =
      await request.json();

    // Check if training already exists by slug
    const existingTraining = await prisma.trainings.findUnique({
      where: { slug },
    });

    if (existingTraining) {
      return NextResponse.json(
        {
          data: null,
          message: `Training (${title}) already exists in the database`,
        },
        { status: 409 }
      );
    }

    const newTraining = await prisma.trainings.create({
      data: { title, slug, categoryId, imageUrl, description, isActive, content },
    });

    return NextResponse.json(
      { data: newTraining, message: "Training created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/trainings failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create training", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trainings = await prisma.trainings.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: trainings,
      message: "Trainings fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/trainings failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch trainings", error: error.message },
      { status: 500 }
    );
  }
}
