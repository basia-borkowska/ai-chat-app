import LoginForm from "@/components/organisms/LoginForm";
import { Subtitle } from "@/components/atoms/typography/Subtitle";
import { Title } from "@/components/atoms/typography/Title";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4">
      <div className="flex flex-col gap-10 w-full max-w-lg rounded-2xl border border-white/15 p-6 shadow-2xl">
        <Image
          src="/logo.svg"
          alt="logo"
          width={96}
          height={24}
          className="h-8 w-auto"
        />
        <div className="flex flex-col gap-3">
          <Title>Sign in</Title>
          <Subtitle>Welcome back! Please sign in to your account.</Subtitle>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
