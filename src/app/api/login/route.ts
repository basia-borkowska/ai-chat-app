import { NextResponse } from "next/server";

const MOCKED_EMAIL = "test@example.com";
const MOCKED_PASSWORD = "password123";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === MOCKED_EMAIL && password === MOCKED_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week,
      path: "/",
    });
    return res;
  }
  return NextResponse.json(
    { ok: false, error: "Invalid credentials" },
    { status: 401 }
  );
}
