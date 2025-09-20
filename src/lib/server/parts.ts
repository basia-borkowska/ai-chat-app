import type { ImageMime, TextlikeMime } from "@/config/uploads";
import { IMAGE_MIME, TEXTLIKE_MIME } from "@/config/uploads";

export type TextPart = { type: "text"; text: string };
export type FilePart = { type: "file"; data: Uint8Array; mediaType: string };
export type UserContent = (TextPart | FilePart)[];

export function isImage(type: string): type is ImageMime {
  return (IMAGE_MIME as readonly string[]).includes(type);
}

export function isTextlike(type: string): type is TextlikeMime {
  return (TEXTLIKE_MIME as readonly string[]).includes(type);
}

export async function filesToParts(files: File[]): Promise<{
  parts: UserContent;
  unsupported: { name: string; type: string }[];
}> {
  const parts: UserContent = [];
  const unsupported: { name: string; type: string }[] = [];

  for (const file of files) {
    const type = file.type || "application/octet-stream";

    if (isImage(type)) {
      const data = new Uint8Array(await file.arrayBuffer());
      parts.push({ type: "file", data, mediaType: type });
      continue;
    }

    if (isTextlike(type)) {
      const text = await file.text();
      parts.push({
        type: "text",
        text: `Attached file "${file.name}" (${type}):\n\n${text}`,
      });
      continue;
    }

    unsupported.push({ name: file.name, type });
  }

  return { parts, unsupported };
}
