"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { Paperclip, SendHorizontal, Upload } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { HelperText } from "@/components/ui/atoms/typography/HelperText";
import { cn } from "@/lib/utils";

type Props = {
  isSending: boolean;
  onSubmit: (message: string) => void;
  files: SelectedFile[];
  setFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>;
};

export default function Composer({
  isSending,
  onSubmit,
  files,
  setFiles,
}: Props) {
  const [value, setValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

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

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    processFiles(selected);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files ?? []);
    processFiles(dropped);
  };

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const message = value.trim();
      if (!message && files.length === 0) return;
      onSubmit(message);
      setValue("");
    },
    [onSubmit, value, files.length]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const dragAndDropClass = cn(
    "relative flex items-end gap-2 p-2 rounded-md transition-colors",
    {
      "ring-2 ring-accent ring-offset-2 ring-offset-dark-secondary bg-dark/20":
        isDragging,
    },
    { "bg-transparent": !isDragging }
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
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

        <div className="relative flex-grow">
          <Textarea
            ref={textareaRef}
            label="Message"
            placeholder="Ask something…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className={cn("!pb-10", dragAndDropClass)}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            rows={3}
          />
          <IconButton
            variant="ghost"
            srLabel="Attach files"
            className="absolute bottom-2 left-2 size-8"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            <Paperclip />
          </IconButton>
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-md bg-dark/40">
              <div className="rounded-md border border-dashed border-accent bg-dark/60 px-6 py-3 text-sm text-light">
                Drop files to attach
              </div>
            </div>
          )}
        </div>

        <IconButton
          type="submit"
          srLabel="Send message"
          disabled={
            isSending || (value.trim().length === 0 && files.length === 0)
          }
        >
          <SendHorizontal />
        </IconButton>
      </div>
      <HelperText>
        Images (PNG/JPEG/WebP/GIF/SVG) and text files (TXT/MD/CSV/JSON) up to
        5MB each, 15MB total.
      </HelperText>
    </form>
  );
}
