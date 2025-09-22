import React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { Edit2, User } from "lucide-react";

export interface AvatarEditProps {
  avatarPreview?: string | null;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AvatarEdit({ avatarPreview, onEdit }: AvatarEditProps) {
  return (
    <div className="group relative">
      {avatarPreview ? (
        <>
          <Avatar src={avatarPreview} alt="Avatar preview" variant="lg" />
          <button
            onClick={onEdit}
            className="group-hover:flex hidden absolute cursor-pointer inset-0 size-20 rounded-full  items-center justify-center opacity-80 bg-light-muted text-dark-secondary"
          >
            <Edit2 />
          </button>
        </>
      ) : (
        <div className="size-20 rounded-full flex items-center justify-center bg-light-muted text-dark-secondary">
          <User />
        </div>
      )}
    </div>
  );
}
