"use client";

import type { SelectedFile } from "@/types/chat";
import Image from "next/image";
import { Button } from "@/components/ui/atoms/Button";
type Props = {
  files: SelectedFile[];
  onRemove: (id: string) => void;
};

export default function FilesPreview({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((f) => (
        <div key={f.id} className="relative rounded-md border p-2">
          {f.url ? (
            <Image
              src={f.url}
              alt={f.file.name}
              className="rounded object-cover"
              width={80}
              height={80}
            />
          ) : (
            <div className="grid place-items-center h-16 w-16 rounded bg-gray-100 text-xs text-gray-600">
              FILE
            </div>
          )}
          <div className="max-w-[240px] text-xs">
            <div className="truncate font-medium">{f.file.name}</div>
            <div className="text-gray-500">
              {(f.file.size / 1024).toFixed(0)} KB • {f.file.type || "unknown"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(f.id)}
            aria-label={`Remove ${f.file.name}`}
            className="absolute right-1 top-1"
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}
