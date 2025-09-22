import * as mammoth from "mammoth";

function toNodeBuffer(ab: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(ab));
}

export async function docxToText(
  buffer: ArrayBuffer,
  filename?: string
): Promise<string> {
  try {
    const nodeBuffer = toNodeBuffer(buffer);

    const { value } = await mammoth.extractRawText({ buffer: nodeBuffer });
    const text = value.trim();

    return `FILE: ${filename ?? "unknown"}\nTYPE: docx\n\n${
      text.length > 0 ? text : "(Empty document)"
    }`;
  } catch (err) {
    return `FILE: ${
      filename ?? "unknown"
    }\nTYPE: docx\n\n(Error extracting text): ${
      err instanceof Error ? err.message : String(err)
    }`;
  }
}
