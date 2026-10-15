import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  language: z.enum(["en", "he"]).default("en"),
});

export async function POST(request: Request) {
  const requestBody = await request.json().catch(() => null);
  const data = schema.safeParse(requestBody);
  const requestedLanguage = requestBody?.language === "he" ? "he" : "en";
  const hebrew = requestedLanguage === "he";
  if (!data.success)
    return NextResponse.json(
      {
        message: hebrew
          ? "הזינו כתובת אימייל תקינה."
          : "Enter a valid email address.",
      },
      { status: 400 },
    );

  try {
    await prisma.preorderWaitlistEntry.upsert({
      where: { email: data.data.email },
      update: {},
      create: { email: data.data.email },
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        {
          message: hebrew
            ? "הצטרפתם לרשימה, אך אימייל האישור אינו מוגדר."
            : "You joined the list, but the confirmation email is not configured.",
        },
        { status: 500 },
      );
    }

    const gmailUser = process.env.GMAIL_USER.trim();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
      },
    });

    const subject = hebrew
      ? "הצטרפתם לרשימת ההזמנה המוקדמת של EYEBREED"
      : "You’re on the EYEBREED preorder list";
    const emailBody = hebrew
      ? "הצטרפתם לרשימת ההזמנה המוקדמת של Vision of Life. ניצור איתכם קשר כשההזמנה המוקדמת תיפתח."
      : "You’re now on the Vision of Life preorder list. We’ll contact you when preorder access opens.";

    await transporter.sendMail({
      from: `EYEBREED <${gmailUser}>`,
      to: data.data.email,
      subject,
      text: emailBody,
      html: `
        <div dir="${hebrew ? "rtl" : "ltr"}" style="background:#25130e;color:#f5eee4;font-family:Arial,sans-serif;padding:40px 24px;text-align:center">
          <div style="max-width:560px;margin:0 auto">
            <p style="font-size:12px;letter-spacing:.34em;margin:0 0 28px">EYEBREED</p>
            <h1 style="font-family:Georgia,serif;font-size:48px;font-weight:500;letter-spacing:-.03em;margin:0 0 10px">VISION OF LIFE</h1>
            <p style="font-size:16px;line-height:1.7;margin:24px 0">${emailBody}</p>
            <p style="font-size:11px;letter-spacing:.22em;margin-top:38px;opacity:.75">${hebrew ? "זה לא העיניים — זה VISION" : "IT’S NOT THE EYES — IT’S THE VISION"}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message: hebrew
        ? "אתם ברשימה. בדקו את האימייל."
        : "You’re on the list. Check your email.",
    });
  } catch (error) {
    console.error("Preorder signup failed:", error);
    return NextResponse.json(
      {
        message: hebrew
          ? "לא הצלחנו להשלים את ההרשמה. נסו שוב."
          : "Couldn’t complete your signup email. Please try again.",
      },
      { status: 500 },
    );
  }
}
