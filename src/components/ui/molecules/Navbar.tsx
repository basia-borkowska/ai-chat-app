"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { MessageCircle, User, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export function Navbar() {
  const router = useRouter();

  const navItems = [
    { label: "Chat", icon: <MessageCircle />, href: "/chat" },
    { label: "Profile", icon: <User />, href: "/profile" },
  ];

  return (
    <nav className="flex items-center justify-between bg-light px-4 py-2">
      <div className="text-accent uppercase font-bold">App logo</div>
      <div className="flex items-center gap-2">
        {navItems.map(({ label, icon, href }) => (
          <IconButton
            key={href}
            srLabel={label}
            onClick={() => router.push(href)}
            variant="ghost"
            className="text-dark-secondary hover:text-dark-secondary/50"
          >
            {icon}
          </IconButton>
        ))}

        <form action={logout}>
          <IconButton
            srLabel="Logout"
            variant="ghost"
            className="text-dark-secondary hover:text-dark-secondary/50"
            type="submit"
          >
            <LogOut />
          </IconButton>
        </form>
      </div>
    </nav>
  );
}
