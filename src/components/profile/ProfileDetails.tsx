"use client";

import { useProfileStore } from "@/store/profile";
import { Edit2, User } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Title } from "@/components/ui/atoms/typography/Title";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { Label } from "../ui/atoms/typography/Label";
import { Paragraph } from "../ui/atoms/typography/Paragraph";
import { useState } from "react";
import ProfileForm from "./ProfileForm";

export default function ProfileDetails() {
  const {
    profile: { name, email, avatarUrl },
  } = useProfileStore();
  const [editView, setEditView] = useState(false);

  if (editView) return <ProfileForm onClose={() => setEditView(false)} />;
  return (
    <div className="mx-auto grid w-full max-w-xl min-w-xl md:min-w-0 gap-6">
      <div className="flex items-center gap-2">
        <Title>Your Profile</Title>
        <IconButton
          onClick={() => setEditView(true)}
          srLabel="Edit profile"
          variant="ghost"
        >
          <Edit2 />
        </IconButton>
      </div>

      <div className="flex flex-col gap-4">
        {avatarUrl ? (
          <Avatar src={avatarUrl} alt="Avatar preview" variant="xl" />
        ) : (
          <div className="size-20 rounded-full flex items-center justify-center bg-light-muted text-dark-secondary">
            <User />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Paragraph>{name}</Paragraph>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Paragraph>{email}</Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}
