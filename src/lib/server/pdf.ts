import type { PDFParseResult } from "pdf-parse/lib/pdf-parse.js";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractPdfText(
  file: File,
  opts: { charLimit?: number } = {}
): Promise<{ text: string; truncated: boolean }> {
  const { charLimit = 20_000 } = opts;

  const arr = new Uint8Array(await file.arrayBuffer());
  const buf = Buffer.from(arr);

  const result: PDFParseResult = await pdfParse(buf);

  let text = (result.text || "").trim();
  const truncated = text.length > charLimit;
  if (truncated) text = text.slice(0, charLimit);

  return { text, truncated };
}
