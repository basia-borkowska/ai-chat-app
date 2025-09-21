"use client";

import { useProfileStore } from "@/store/profile";
import { Edit2, Loader2, User } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Title } from "@/components/ui/atoms/typography/Title";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { Label } from "../ui/atoms/typography/Label";
import { Paragraph } from "../ui/atoms/typography/Paragraph";
import { useState } from "react";
import ProfileForm from "./ProfileForm";
import { Badge } from "../ui/atoms/Badge";

export default function ProfileDetails() {
  const {
    profile: { name, email, avatarUrl, bio, skills },
    hasHydrated,
  } = useProfileStore();
  const [editView, setEditView] = useState(false);

  if (!hasHydrated) return <Loader2 className="mx-auto animate-spin" />;
  if (editView) return <ProfileForm onClose={() => setEditView(false)} />;
  return (
    <div className="mx-auto grid w-full max-w-7xl min-w-xl md:min-w-0 gap-6">
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

          {!!skills?.length && (
            <div className="flex flex-col gap-1">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {bio && (
            <div className="flex flex-col gap-1">
              <Label>Bio</Label>
              <Paragraph>{bio}</Paragraph>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
