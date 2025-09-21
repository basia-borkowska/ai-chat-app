"use client";

import { useRef } from "react";
import type { SelectedFile } from "@/types/chat";
import { Button } from "@/components/ui/atoms/Button";
import {
  SUPPORTED_MIME,
  MAX_FILE_SIZE_BYTES,
  IMAGE_MIME,
  SupportedMime,
  MAX_TOTAL_SIZE_BYTES,
} from "@/config/uploads";
import { Textarea } from "@/components/ui/atoms/Field";

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
      className="grid gap-2 mx-6"
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
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Attach
        </Button>

        <Textarea
          label="Message"
          placeholder="Ask something…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
        />
        <Button
          type="submit"
          disabled={
            isSending || (value.trim().length === 0 && files.length === 0)
          }
        >
          Send
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Images (PNG/JPEG/WebP/GIF/SVG) and text files (TXT/MD/CSV/JSON) up to
        5MB each, 15MB total.
      </p>
    </form>
  );
}
