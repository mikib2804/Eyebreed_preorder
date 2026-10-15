"use client";

import { FormEvent, useState } from "react";

export function AdminMailer() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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
    <form className="admin-card" onSubmit={submit}>
      <p>EYEBREED</p>
      <h1>Email the preorder list</h1>
      <label>
        Admin password
        <input name="secret" type="password" required />
      </label>
      <label>
        Subject
        <input name="subject" required />
      </label>
      <label>
        Message
        <textarea name="message" rows={10} required />
      </label>
      <button disabled={sending}>
        {sending ? "SENDING…" : "SEND TO EVERYONE"}
      </button>
      <output>{message}</output>
    </form>
  );
}
