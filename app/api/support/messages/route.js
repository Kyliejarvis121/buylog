// app/api/customer-support/messages/route.js
import { prisma } from "@/lib/prismadb";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    // Save the support message in MongoDB
    const savedMessage = await prisma.supportMessage.create({
      data: {
        name: name || "Anonymous",
        email: email || null,
        message,
        status: "pending",
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: savedMessage }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving support message:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
