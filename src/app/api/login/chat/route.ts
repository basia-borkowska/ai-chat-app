import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    model: openai("gpt-4o-mini"),
    prompt,
  });

  return result.toTextStreamResponse();
}
