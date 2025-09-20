"use client";

import { useRef } from "react";
import type { SelectedFile } from "@/types/chat";
import { SUPPORTED_IMAGE_MIME } from "@/types/chat";

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

    for (const file of selected) {
      if (
        !SUPPORTED_IMAGE_MIME.includes(
          file.type as (typeof SUPPORTED_IMAGE_MIME)[number]
        )
      ) {
        skipped.push(file.name);
        continue;
      }
      const url = URL.createObjectURL(file);
      accepted.push({ id: crypto.randomUUID(), file, url });
    }
    if (skipped.length) {
      alert(`Unsupported, skipped files: ${skipped.join(", ")}`);
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
          accept={SUPPORTED_IMAGE_MIME.join(",")}
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
        Supported: PNG, JPEG, WebP, GIF, SVG.
      </p>
    </form>
  );
}
