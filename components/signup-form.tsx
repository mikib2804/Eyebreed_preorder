"use client";

import { FormEvent, useState } from "react";

export function SignupForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/preorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = (await response.json()) as { message: string };
    setStatus(response.ok ? "success" : "error");
    setMessage(result.message);
    if (response.ok) form.reset();
  }

  return (
    <form onSubmit={submit} className="signup">
      <div className="email-row">
        <input name="email" type="email" required autoComplete="email" placeholder="EMAIL ADDRESS" aria-label="Email address" />
        <span aria-hidden="true">✉</span>
      </div>
      <button disabled={status === "loading"}>
        {status === "loading" ? "JOINING…" : "JOIN THE LIST"} <b>→</b>
      </button>
      <p className={status === "error" ? "error" : ""} aria-live="polite">{message}</p>
    </form>
  );
}
