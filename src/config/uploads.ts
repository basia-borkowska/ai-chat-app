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

export const DOCX_MIME = [
  ".docx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const DOC_MIME = ["application/pdf"] as const;

export const SUPPORTED_MIME = [
  ...IMAGE_MIME,
  ...TEXTLIKE_MIME,
  ...DOC_MIME,
  ...DOCX_MIME,
] as const;

// Types
export type ImageMime = (typeof IMAGE_MIME)[number];
export type TextlikeMime = (typeof TEXTLIKE_MIME)[number];
export type DocMime = (typeof DOC_MIME)[number];
export type DocxMime = (typeof DOCX_MIME)[number];
export type SupportedMime = (typeof SUPPORTED_MIME)[number];

// Limits
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file
export const MAX_TOTAL_SIZE_BYTES = 15 * 1024 * 1024; // 15MB per request
