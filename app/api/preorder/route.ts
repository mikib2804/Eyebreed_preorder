import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
});

export async function POST(request: Request) {
  const data = schema.safeParse(await request.json().catch(() => null));
  if (!data.success) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });

  try {
    await prisma.preorderWaitlistEntry.upsert({
      where: { email: data.data.email },
      update: {},
      create: { email: data.data.email },
    });
    return NextResponse.json({ message: "You’re on the preorder list." });
  } catch {
    return NextResponse.json({ message: "Couldn’t save your email. Please try again." }, { status: 500 });
  }
}
