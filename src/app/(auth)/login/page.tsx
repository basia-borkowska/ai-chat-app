import LoginForm from "@/components/auth/LoginForm";
import { Subtitle } from "@/components/ui/atoms/typography/Subtitle";
import { Title } from "@/components/ui/atoms/typography/Title";

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4">
      <div className="w-full flex flex-col gap-5 max-w-md rounded-2xl border p-6 shadow-sm">
        <Title>Sign in</Title>
        <Subtitle>Welcome back! Please sign in to your account.</Subtitle>
        <LoginForm />
      </div>
    </div>
  );
}
