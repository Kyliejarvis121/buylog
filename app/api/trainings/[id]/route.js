// app/api/trainings/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ONE TRAINING
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const training = await prisma.training.findUnique({
      where: { id },
    });

    if (!training) {
      return NextResponse.json(
        { message: "Training Not Found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error("Failed to fetch training:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Training", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE TRAINING
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingTraining = await prisma.training.findUnique({ where: { id } });

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
      { message: "Failed to Delete Training", error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE TRAINING
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    const body = await request.json();

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
      data: body,
    });

    return NextResponse.json(updatedTraining);
  } catch (error) {
    console.error("Failed to update training:", error);
    return NextResponse.json(
      { message: "Failed to Update Training", error: error.message },
      { status: 500 }
    );
  }
}
