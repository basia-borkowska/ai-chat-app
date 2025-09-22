"use client";

import type { SelectedFile } from "@/types/chat";
import { FilePreview } from "@/components/molecules/FilePreview";
import { getFileExtension } from "@/lib/files";
type Props = {
  files: SelectedFile[];
  onRemove: (id: string) => void;
};

export default function FilesPreview({ files, onRemove }: Props) {
  if (files.length === 0) return null;

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
