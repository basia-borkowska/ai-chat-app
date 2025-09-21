import LoginForm from "@/components/auth/LoginForm";
import { Subtitle } from "@/components/ui/atoms/typography/Subtitle";
import { Title } from "@/components/ui/atoms/typography/Title";

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4">
      <div className="flex flex-col gap-10 w-full max-w-lg rounded-2xl border border-white/15 p-6 shadow-2xl">
        <div className="flex flex-col gap-3">
          <Title>Sign in</Title>
          <Subtitle>Welcome back! Please sign in to your account.</Subtitle>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
