"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  (await cookies()).set("auth", "", { path: "/", maxAge: 0 });
  redirect("/login");
}
