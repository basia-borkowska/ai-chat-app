import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

type TextPart = { type: "text"; text: string };
type ImagePart = {
  type: "file";
  data: Uint8Array;
  mediaType: string;
};
type UserContent = (TextPart | ImagePart)[];

export async function POST(req: Request) {
  const formData = await req.formData();

  const prompt = (formData.get("prompt") as string) || "";
  const files = formData
    .getAll("files")
    .filter((file) => file instanceof File) as File[];

  const parts: UserContent = [];

  if (prompt) parts.push({ type: "text", text: prompt });

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const bytes = new Uint8Array(await file.arrayBuffer());
    parts.push({
      type: "file",
      data: bytes,
      mediaType: file.type,
    });
  }

  if (parts.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing input" },
      { status: 400 }
    );
  }

  if (!prompt) {
    parts.unshift({
      type: "text",
      text: "Analyze the attached images and describe them briefly.",
    });
  }

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages: [{ role: "user", content: parts }],
  });

  return result.toTextStreamResponse();
}
