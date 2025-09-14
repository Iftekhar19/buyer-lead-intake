import { NextResponse } from "next/server";

export async function POST() {
  // Create a response
  const res = NextResponse.json({ message: "Logged out successfully" });

  // Clear the cookie by setting it with an expired date
  res.cookies.set("demo_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0), // expire immediately
    maxAge:0,
    path: "/",            // must match the cookie path
  });

  return res;
}
