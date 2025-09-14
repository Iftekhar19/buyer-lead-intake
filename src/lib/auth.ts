// lib/auth.ts
import { cookies } from "next/headers";
import {prisma} from "@/lib/db";

export async function getCurrentUser() {
  const raw = (await cookies()).get("demo_token")?.value;
  if (!raw) return null;

  const { userId } = JSON.parse(raw);
  // console.log(JSON.parse(raw))
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}
