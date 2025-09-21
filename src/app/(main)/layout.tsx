import { ReactNode } from "react";
import { logout } from "./logoutAction";
import { Button } from "@/components/ui/atoms/Button";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <form action={logout}>
        <Button>Logout</Button>
      </form>
      {children}
    </div>
  );
}
