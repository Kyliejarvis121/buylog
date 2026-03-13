import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Buylog AI Support.

PRIMARY ROLE:
- Help users understand Buylog
- Selling, withdrawals, safety, disputes, how the app works

SECONDARY ROLE:
- You MAY answer general questions politely (tech, business, basic info)
- If a question is totally unrelated, respond briefly and guide back to Buylog

STYLE:
- Friendly
- Clear
- Professional
- Not robotic
          `,
        },
        ...messages.filter((m) => m.role !== "ai"), // map ai → assistant
      ].map((m) =>
        m.role === "ai" ? { role: "assistant", content: m.content } : m
      ),
    });

    return new Response(
      JSON.stringify({
        answer: completion.choices[0].message.content,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(
      JSON.stringify({ error: "AI failed to respond" }),
      { status: 500 }
    );
  }
}
