import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "edge";
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const GEMINI_MODEL = "gemini-1.5-flash";
