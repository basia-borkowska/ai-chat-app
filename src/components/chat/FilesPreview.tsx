"use client";

import type { SelectedFile } from "@/types/chat";
import { FilePreview } from "@/components/ui/molecules/FilePreview";
type Props = {
  files: SelectedFile[];
  onRemove: (id: string) => void;
};

export default function FilesPreview({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  function getFileExtension(file: File): string {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {files.map(({ id, file, url }) => (
        <FilePreview
          key={id}
          id={id}
          name={file.name}
          extension={getFileExtension(file)}
          url={url}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
