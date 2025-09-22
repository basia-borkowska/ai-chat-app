"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { HelperText } from "@/components/atoms/typography/HelperText";
import { PATHS } from "@/config/paths";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => {});
        const message = data?.error || "Something went wrong";
        setServerError(message);
        return;
      }
      window.location.href = PATHS.chat;
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        placeholder="********"
        {...register("password")}
        error={errors.password?.message}
      />

      {serverError && (
        <HelperText className="text-accent-highlight">{serverError}</HelperText>
      )}
      <Button loading={isSubmitting} disabled={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
