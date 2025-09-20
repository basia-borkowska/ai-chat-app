"use client";

import { useRef } from "react";
import type { SelectedFile, SupportedMime } from "@/types/chat";
import {
  SUPPORTED_MIME,
  IMAGE_MIME,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_SIZE_BYTES,
} from "@/types/chat";

type Props = {
  value: string;
  setValue: (v: string) => void;
  isSending: boolean;
  onSubmit: () => void;
  files: SelectedFile[];
  setFiles: (
    files: SelectedFile[] | ((prev: SelectedFile[]) => SelectedFile[])
  ) => void;
};

export default function Composer({
  value,
  setValue,
  isSending,
  onSubmit,
  files,
  setFiles,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const accepted: SelectedFile[] = [];
    const skipped: string[] = [];
    const reasons: string[] = [];

    const currentTotal = files.reduce((sum, { file }) => sum + file.size, 0);
    const newTotal = currentTotal;

    for (const file of selected) {
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
      if (newTotal + file.size > MAX_TOTAL_SIZE_BYTES) {
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
      const isImage = IMAGE_MIME.includes(type as (typeof IMAGE_MIME)[number]);
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

    setFiles((prev) => [...prev, ...accepted]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-2"
    >
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          multiple
          onChange={onSelectFiles}
          className="hidden"
          accept={SUPPORTED_MIME.join(",")}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-12 rounded-md border px-3"
        >
          Attach
        </button>

        <textarea
          className="min-h-12 flex-1 rounded-md border px-3 py-2 outline-none focus:ring"
          placeholder="Ask something…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
        />
        <button
          type="submit"
          disabled={
            isSending || (value.trim().length === 0 && files.length === 0)
          }
          className="h-12 rounded-md bg-black px-4 text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Images (PNG/JPEG/WebP/GIF/SVG) and text files (TXT/MD/CSV/JSON) up to
        5MB each, 15MB total.
      </p>
    </form>
  );
}
