"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/store/profile";
import type { UserProfile } from "@/types/profile";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/atoms/Button";
import { Input } from "@/components/ui/atoms/Field";
import { Trash2, Upload } from "lucide-react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Title } from "@/components/ui/atoms/typography/Title";
import { AvatarEdit } from "../ui/molecules/AvatarEdit";

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

type ProfileInput = z.infer<typeof ProfileSchema>;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function ProfileForm({ onClose }: { onClose: () => void }) {
  const {
    profile: { name, email, avatarUrl },
    setProfile,
    hasHydrated,
  } = useProfileStore();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    avatarUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset: resetForm,
  } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (!hasHydrated) return;
    resetForm({ name, email });
    setAvatarPreview(avatarUrl ?? null);
  }, [hasHydrated, name, email, avatarUrl, resetForm]);

  const onSubmit = useCallback(
    async (data: ProfileInput) => {
      setSaving(true);
      try {
        const newProfile: Partial<UserProfile> = {
          name: data.name,
          email: data.email,
          avatarUrl: avatarPreview,
        };
        setProfile(newProfile);
        resetForm(data);
      } finally {
        setSaving(false);
        onClose();
      }
    },
    [avatarPreview, resetForm, setProfile, onClose]
  );

  const onPickAvatar = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please choose an image file.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large (max 5MB).");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const dataUrl = await fileToDataUrl(file);
      setAvatarPreview(dataUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const onRemoveAvatar = useCallback(() => {
    setAvatarPreview(null);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid w-full max-w-xl gap-6"
      aria-busy={saving}
    >
      <Title>Your Profile</Title>

      <div className="flex items-center gap-4">
        <AvatarEdit
          avatarPreview={avatarPreview}
          onEdit={() => fileInputRef.current?.click()}
        />

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPickAvatar}
          />
          {avatarPreview ? (
            <IconButton
              variant="ghost"
              srLabel="Remove avatar"
              onClick={onRemoveAvatar}
            >
              <Trash2 />
            </IconButton>
          ) : (
            <IconButton
              variant="secondary"
              srLabel="Upload avatar"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload />
            </IconButton>
          )}
        </div>
      </div>

      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input
        label="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="ml-auto flex gap-2">
        <Button onClick={onClose} variant="ghost" disabled={saving}>
          Close
        </Button>
        <Button
          type="submit"
          loading={saving}
          disabled={
            saving || (!isDirty && avatarPreview === (avatarUrl ?? null))
          }
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
