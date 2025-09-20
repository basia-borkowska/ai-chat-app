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

export type ImageMime = (typeof IMAGE_MIME)[number];
export type TextlikeMime = (typeof TEXTLIKE_MIME)[number];

// Size limits
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file
export const MAX_TOTAL_SIZE_BYTES = 15 * 1024 * 1024; // 15MB per request
