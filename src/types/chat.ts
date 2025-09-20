export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type SelectedFile = {
  id: string;
  file: File;
  url?: string;
};

export const IMAGE_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const TEXTLIKE_MIME = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
] as const;

export const SUPPORTED_MIME = [...IMAGE_MIME, ...TEXTLIKE_MIME] as const;

export type SupportedMime = (typeof SUPPORTED_MIME)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file
export const MAX_TOTAL_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB per request
