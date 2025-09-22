import { ReactNode } from "react";
import { Navbar } from "@/components/molecules/Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto my-4 px-4 mx-auto w-full max-w-7xl">
        {children}
      </main>
    </div>
  );
}
