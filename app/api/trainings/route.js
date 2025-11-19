import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      title,
      slug,
      categoryId,
      imageUrl,
      description,
      isActive,
      content,
    } = await request.json();

    // Check if this training already exists
    const existingTraining = await prisma.training.findUnique({
      where: { slug },
    });

    if (existingTraining) {
      return NextResponse.json(
        {
          data: null,
          message: `Training (${title}) already exists in the Database`,
        },
        { status: 409 }
      );
    }

    const newTraining = await prisma.training.create({
      data: {
        title,
        slug,
        categoryId,
        imageUrl,
        description,
        isActive,
        content,
      },
    });

    console.log(newTraining);
    return NextResponse.json(newTraining);
  } catch (error) {
    console.error("Failed to create Training:", error);
    return NextResponse.json(
      {
        message: "Failed to create Training",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(trainings);
  } catch (error) {
    console.error("Failed to fetch Trainings:", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Trainings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
