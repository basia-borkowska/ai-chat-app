"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/store/profile";
import type { UserProfile } from "@/types/profile";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

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

export default function ProfileForm() {
  const {
    profile: { name, email, avatarUrl },
    setProfile,
    hasHydrated,
  } = useProfileStore();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl ?? null);
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
      }
    },
    [avatarPreview, resetForm, setProfile]
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
      className="mx-auto grid w-full max-w-xl gap-4"
      aria-busy={saving}
    >
      <h1 className="text-2xl font-semibold">Your Profile</h1>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full border bg-gray-50">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              className="object-cover"
              width={80}
              height={80}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-gray-500">
              No photo
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPickAvatar}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 rounded-md border px-3"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={onRemoveAvatar}
            disabled={!avatarPreview}
            className="h-9 rounded-md border px-3 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      <label className="grid gap-1 text-sm">
        <span>Name</span>
        <input
          className="h-10 rounded-md border px-3 outline-none focus:ring"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-xs text-red-600">{errors.name.message}</span>
        )}
      </label>

      <label className="grid gap-1 text-sm">
        <span>Email</span>
        <input
          type="email"
          className="h-10 rounded-md border px-3 outline-none focus:ring"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={
            saving || (!isDirty && avatarPreview === (avatarUrl ?? null))
          }
          className="h-10 rounded-md bg-black px-4 text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Profile is stored locally in your browser (no server sync).
      </p>
    </form>
  );
}
