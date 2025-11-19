import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const training = await prisma.training.findUnique({
      where: { id },
    });
    return NextResponse.json(training);
  } catch (error) {
    console.error("Failed to fetch training:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Training", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingTraining = await prisma.training.findUnique({
      where: { id },
    });
    if (!existingTraining) {
      return NextResponse.json(
        { data: null, message: "Training Not Found" },
        { status: 404 }
      );
    }

    const deletedTraining = await prisma.training.delete({
      where: { id },
    });
    return NextResponse.json(deletedTraining);
  } catch (error) {
    console.error("Failed to delete training:", error);
    return NextResponse.json(
      { message: "Failed to Delete Training", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
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

    const existingTraining = await prisma.training.findUnique({
      where: { id },
    });

    if (!existingTraining) {
      return NextResponse.json(
        { data: null, message: "Training Not Found" },
        { status: 404 }
      );
    }

    const updatedTraining = await prisma.training.update({
      where: { id },
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

    return NextResponse.json(updatedTraining);
  } catch (error) {
    console.error("Failed to update training:", error);
    return NextResponse.json(
      { message: "Failed to Update Training", error: error.message || error },
      { status: 500 }
    );
  }
}
