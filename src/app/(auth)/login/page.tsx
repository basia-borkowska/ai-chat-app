import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
