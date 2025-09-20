"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { is } from "zod/locales";

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
    setError,
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
      window.location.href = "/chat";
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        <span>Email</span>
        <input
          type="email"
          className="h-10 rounded-md border px-3 outline-none focus:ring"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </label>
      <label className="grid gap-1 text-sm">
        <span>Password</span>
        <input
          type="password"
          placeholder="******"
          className="h-10 rounded-md border px-3 outline-none focus:ring"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-xs text-red-600">
            {errors.password.message}
          </span>
        )}
      </label>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button className="h-9 rounded-md border px-3" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-xs text-gray-500">
        Helper for testing: use <code>test@example.com</code> /{" "}
        <code>password123</code>
      </p>
    </form>
  );
}
