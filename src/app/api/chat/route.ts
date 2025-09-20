import { GEMINI_MODEL, google } from "@/lib/server/ai";
import { filesToParts, UserContent } from "@/lib/server/parts";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const prompt = (formData.get("prompt") as string) || "";
  const files = formData
    .getAll("files")
    .filter((file) => file instanceof File) as File[];

  const { parts: fileParts, unsupported, notes } = await filesToParts(files);

  const parts: UserContent = [];
  if (prompt) parts.push({ type: "text", text: prompt });
  parts.push(...fileParts);

  if (parts.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing input" },
      { status: 400 }
    );
  }

  if (!prompt) {
    parts.unshift({
      type: "text",
      text: "Analyze the attached content/images and be concise.",
    });
  }

  if (unsupported.length > 0) {
    const list = unsupported
      .map((u) => `${u.name} (${u.type || "unknown"})`)
      .join(", ");
    parts.push({
      type: "text",
      text: `⚠️ Note: The following files were ignored because they are not supported: ${list}.`,
    });
  }

  for (const note of notes) {
    parts.push({ type: "text", text: `Note: ${note}` });
  }

  const result = streamText({
    model: google(GEMINI_MODEL),
    messages: [{ role: "user", content: parts }],
  });

  return result.toTextStreamResponse();
}
