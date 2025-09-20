import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

type ChatRequest = { prompt?: string };

export async function POST(req: Request) {
  let body: ChatRequest = {};
  try {
    body = await req.json();
  } catch {}

  const { prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json(
      { ok: false, error: "Prompt is required" },
      { status: 400 }
    );
  }

  const result = streamText({
    model: google("gemini-1.5-flash"),
    prompt,
  });

  return result.toTextStreamResponse();
}
