"use client";

import * as React from "react";
import Image from "next/image";
import { X, File } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Subtitle } from "@/components/ui/atoms/typography/Subtitle";
import { cn } from "@/lib/utils";

export type FilePreviewProps = {
  id: string;
  name: string;
  url?: string;
  extension: string;
  onRemove: (id: string) => void;
};

export function FilePreview({
  id,
  name,
  url,
  extension,
  onRemove,
}: FilePreviewProps) {
  const isImage = !!url;

  const getExtensionColor = () => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "xls":
      case "xlsx":
        return "bg-green-100 text-green-700";
      case "txt":
        return "bg-cyan-100 text-cyan-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative flex items-center rounded-md bg-light-muted p-2">
      <div
        className={cn(
          "flex size-16 items-center justify-center overflow-hidden rounded",
          getExtensionColor()
        )}
      >
        {isImage ? (
          <Image
            src={url}
            alt={name}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <div className="relative">
            <File className="size-12 stroke-1" />
            <Subtitle className="uppercase text-current absolute inset-0 mt-2 flex h-full w-full items-center justify-center text-xs font-bold">
              {extension}
            </Subtitle>
          </div>
        )}
      </div>

      <Subtitle className="mt-2 w-24 truncate text-center text-xs text-dark-secondary">
        {name}
      </Subtitle>

      <div className="absolute right-2 top-2">
        <IconButton
          srLabel="Remove file"
          variant="ghost"
          size="sm"
          className="text-dark-secondary !p-0 h-fit"
          onClick={() => onRemove(id)}
        >
          <X />
        </IconButton>
      </div>
    </div>
  );
}
