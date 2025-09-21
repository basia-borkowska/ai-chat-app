"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectedFile } from "@/types/chat";
import { SUPPORTED_MIME } from "@/config/uploads";
import { Textarea } from "@/components/ui/atoms/Field";
import { Paperclip, SendHorizontal } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { cn } from "@/lib/utils";
import { MicButton } from "../ui/molecules/MicButton";
import { useComposerFiles } from "@/hooks/useComposerFiles";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

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
  const [shadowValue, setShadowValue] = useState<string>("");
  const { processFiles } = useComposerFiles(files, setFiles);
  const { ref: textareaRef, resize } =
    useAutoResizeTextarea<HTMLTextAreaElement>();

  useEffect(() => {
    resize();
  }, [value, resize]);

  function applyTranscript(text: string, kind: "final" | "interim") {
    if (kind === "interim") {
      setShadowValue(text);
      return;
    }

    setShadowValue("");
    setValue((prev) => {
      if (!prev) return text;
      const sep = prev.endsWith(" ") ? "" : " ";
      return `${prev}${sep}${text}`;
    });
  }

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
            value={value + (shadowValue ? ` ${shadowValue}` : "")}
            onChange={(e) => {
              setShadowValue("");
              setValue(e.currentTarget.value);
            }}
            onKeyDown={onKeyDown}
            className={cn("!pb-10", dragAndDropClass)}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            rows={3}
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <IconButton
              variant="ghost"
              srLabel="Attach files"
              className=" size-8"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              <Paperclip />
            </IconButton>
            <MicButton onTranscript={applyTranscript} />
          </div>

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
    </form>
  );
}
