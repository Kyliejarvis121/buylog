import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Buylog AI Customer Support.
Answer clearly and simply.
Only answer questions related to:
- Selling on Buylog
- Withdrawals
- Safety and scams
- How Buylog works

If the question is unrelated, politely redirect.
          `,
        },
        { role: "user", content: question },
      ],
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
