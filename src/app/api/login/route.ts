import { prisma } from "@/lib/db";
import { loginSchema } from "@/zod-schemas/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Demo User",
          password, // ⚠️ hash this in real apps
        },
      });
    }

    const token = JSON.stringify({ userId: user.id });

    const response = NextResponse.json({ ...user });

    response.cookies.set("demo_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      secure: process.env.NODE_ENV === "production", // ❗ only secure on prod
      sameSite: "lax",
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
