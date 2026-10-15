import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  subject: z.string().trim().min(1).max(180),
  message: z.string().trim().min(1).max(20_000),
});

export async function POST(request: Request) {
  const data = schema.safeParse(await request.json().catch(() => null));
  if (!data.success)
    return NextResponse.json(
      { message: "Add a subject and message." },
      { status: 400 },
    );

  try {
    const people = await prisma.preorderWaitlistEntry.findMany({
      select: { id: true, email: true },
    });
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { message: "Email is not configured." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER.trim(),
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
      },
    });

    let sent = 0;

    for (const person of people) {
      await transporter.sendMail({
        from: `EYEBREED <${process.env.GMAIL_USER.trim()}>`,
        to: person.email,
        subject: data.data.subject,
        text: data.data.message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap">${escapeHtml(data.data.message)}</div>`,
      });
      await prisma.preorderWaitlistEntry.update({
        where: { id: person.id },
        data: { lastEmailedAt: new Date() },
      });
      sent += 1;
    }

    return NextResponse.json({ message: `Email sent to ${sent} people.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "Email sending failed. Check the Gmail address and App Password.",
      },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character,
  );
}
