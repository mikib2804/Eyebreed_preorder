"use client";

import { FormEvent, useState } from "react";

export function AdminMailer() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [hebrew, setHebrew] = useState(false);

  const copy = hebrew
    ? { title: "שליחת אימייל לרשימת ההזמנה", password: "סיסמת מנהל", subject: "נושא", body: "הודעה", send: "שליחה לכולם", sending: "שולח…" }
    : { title: "Email the preorder list", password: "Admin password", subject: "Subject", body: "Message", send: "SEND TO EVERYONE", sending: "SENDING…" };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSending(true);
    setMessage("");
    const response = await fetch("/api/admin/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${values.get("secret")}`,
      },
      body: JSON.stringify({
        subject: values.get("subject"),
        message: values.get("message"),
      }),
    });
    const result = (await response.json()) as { message: string };
    setMessage(result.message);
    setSending(false);
  }

  return (
    <div dir={hebrew ? "rtl" : "ltr"} className="relative grid min-h-svh place-items-center bg-[#eee6da] px-5 py-12 text-[#28170f]">
      <div className="absolute right-5 top-5 flex gap-2 font-display text-sm tracking-[.15em]">
        <button type="button" onClick={() => setHebrew(false)} className={!hebrew ? "font-semibold" : "opacity-45"}>EN</button>
        <span className="opacity-30">|</span>
        <button type="button" onClick={() => setHebrew(true)} className={hebrew ? "font-semibold" : "opacity-45"}>עב</button>
      </div>
      <form className="grid w-full max-w-2xl gap-5 border border-[#6b402b]/25 bg-[#f8f2e9] p-7 shadow-[0_24px_80px_rgba(55,29,18,.15)] sm:p-12" onSubmit={submit}>
      <p className="font-display text-sm tracking-[.35em]">EYEBREED</p>
      <h1 className="font-display text-4xl sm:text-5xl">{copy.title}</h1>
      <label className="grid gap-2 text-xs font-medium tracking-[.12em]">
        {copy.password}
        <input className="border border-[#6b402b]/30 bg-transparent px-4 py-3 text-base outline-none focus:border-[#6b402b]" name="secret" type="password" required />
      </label>
      <label className="grid gap-2 text-xs font-medium tracking-[.12em]">
        {copy.subject}
        <input className="border border-[#6b402b]/30 bg-transparent px-4 py-3 text-base outline-none focus:border-[#6b402b]" name="subject" required />
      </label>
      <label className="grid gap-2 text-xs font-medium tracking-[.12em]">
        {copy.body}
        <textarea className="resize-y border border-[#6b402b]/30 bg-transparent px-4 py-3 text-base leading-relaxed outline-none focus:border-[#6b402b]" name="message" rows={10} required />
      </label>
      <button className="min-h-14 bg-[#321c12] px-6 font-display text-lg tracking-[.2em] text-[#f7eee3] transition hover:bg-[#1d100b] disabled:opacity-60" disabled={sending}>
        {sending ? copy.sending : copy.send}
      </button>
      <output className="min-h-5 text-sm">{message}</output>
      </form>
    </div>
  );
}
