import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateFitnessPrompt } from "@/lib/prompt";

export const runtime = "nodejs"; // 

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    // ✅ Create OpenAI client INSIDE handler
    const openai = new OpenAI({
      apiKey,
    });

    const user = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a backend API. Respond ONLY with valid JSON. Do NOT use markdown, backticks, or explanations.",
        },
        {
          role: "user",
          content: generateFitnessPrompt(user),
        },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const plan = JSON.parse(cleaned);

    const daysOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    plan.workout_plan = plan.workout_plan
      .filter((d: any) => daysOrder.includes(d.day))
      .slice(0, 6)
      .map((day: any) => ({
        ...day,
        duration: day.duration || "30 minutes",
      }));

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("AI GENERATION ERROR:", error.message);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
