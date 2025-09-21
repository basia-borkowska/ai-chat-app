import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PATHS } from "./config/paths";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("auth")?.value === "true";
  const { pathname } = req.nextUrl;

  if (
    !isLoggedIn &&
    (pathname.startsWith(PATHS.chat) || pathname.startsWith(PATHS.profile))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = PATHS.login;
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && pathname.startsWith(PATHS.login)) {
    const url = req.nextUrl.clone();
    url.pathname = PATHS.chat;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [PATHS.root, PATHS.login, PATHS.chat, PATHS.profile],
};
