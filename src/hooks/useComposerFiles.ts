"use client";

import type { SelectedFile } from "@/types/chat";
import {
  SUPPORTED_MIME,
  MAX_FILE_SIZE_BYTES,
  IMAGE_MIME,
  SupportedMime,
  MAX_TOTAL_SIZE_BYTES,
} from "@/config/uploads";
import { useCallback } from "react";

export function useComposerFiles(
  files: SelectedFile[],
  setFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>
) {
  const processFiles = useCallback(
    (incoming: File[]) => {
      if (!incoming.length) return;

      const accepted: SelectedFile[] = [];
      const skipped: string[] = [];
      const reasons: string[] = [];

      let currentTotal = files.reduce((sum, { file }) => sum + file.size, 0);

      for (const file of incoming) {
        const type = file.type as SupportedMime;

        if (!SUPPORTED_MIME.includes(type as SupportedMime)) {
          skipped.push(file.name);
          reasons.push(`Unsupported type: ${file.type || "unknown"}`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          skipped.push(file.name);
          reasons.push(
            `Too large (> ${(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0)}MB)`
          );
          continue;
        }

        if (currentTotal + file.size > MAX_TOTAL_SIZE_BYTES) {
          skipped.push(file.name);
          reasons.push(
            `Total size would exceed ${(
              MAX_TOTAL_SIZE_BYTES /
              1024 /
              1024
            ).toFixed(0)}MB`
          );
          continue;
        }

        currentTotal += file.size;

        const isImage = IMAGE_MIME.includes(
          type as (typeof IMAGE_MIME)[number]
        );
        accepted.push({
          id: crypto.randomUUID(),
          file,
          url: isImage ? URL.createObjectURL(file) : undefined,
        });
      }

      if (skipped.length) {
        alert(
          `Some files were skipped:\n- ${skipped.join(
            "\n- "
          )}\n\nReasons (first few):\n${reasons.slice(0, 3).join("\n")}`
        );
      }

      if (accepted.length) setFiles((prev) => [...prev, ...accepted]);
    },
    [files, setFiles]
  );

  return { processFiles };
}
