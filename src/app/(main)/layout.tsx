import { ReactNode } from "react";
import { logout } from "./logoutAction";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <form action={logout}>
        <button className="h-9 rounded-md border px-3">Logout</button>
      </form>
      {children}
    </div>
  );
}
