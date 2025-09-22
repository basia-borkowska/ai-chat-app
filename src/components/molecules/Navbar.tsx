"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/atoms/IconButton";
import { MessageCircle, User, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { PATHS } from "@/config/paths";

export function Navbar() {
  const router = useRouter();

  const navItems = [
    { label: "Chat", icon: <MessageCircle />, href: PATHS.chat },
    { label: "Profile", icon: <User />, href: PATHS.profile },
  ];

  return (
    <nav className="flex items-center justify-between bg-dark px-4 py-2">
      <Link
        href={PATHS.chat}
        className="inline-flex items-center cursor-pointer"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={96}
          height={24}
          className="h-6 w-auto"
        />
      </Link>
      <div className="flex items-center gap-2">
        {navItems.map(({ label, icon, href }) => (
          <IconButton
            key={href}
            srLabel={label}
            onClick={() => router.push(href)}
            variant="ghost"
          >
            {icon}
          </IconButton>
        ))}

        <form action={logout}>
          <IconButton srLabel="Logout" variant="ghost" type="submit">
            <LogOut />
          </IconButton>
        </form>
      </div>
    </nav>
  );
}
