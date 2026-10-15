"use client";

import Image from "next/image";
import { ArrowRight, Check, Mail, MousePointer2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { PaymentSupport } from "./payment-support";

type FormStatus = "idle" | "submitting" | "success" | "error";
type Language = "en" | "he";

const translations = {
  en: {
    preorder: "PREORDER",
    emailLabel: "Email address",
    emailPlaceholder: "EMAIL ADDRESS",
    joining: "JOINING…",
    join: "JOIN THE LIST",
    fallbackError: "Please try again.",
    eyes: "IT’S NOT THE EYES",
    vision: "IT’S THE VISION",
    rights: "© 2026 EYEBREED™. All Rights Reserved.",
    powered: "DESIGNED AND POWERED BY EASYPASSPROJECTS ©",
    successTitle: "YOU’RE ON THE LIST",
    successBody: "Check your email for confirmation.",
    accept: "ACCEPT",
  },
  he: {
    preorder: "הזמנה מוקדמת",
    emailLabel: "כתובת אימייל",
    emailPlaceholder: "כתובת אימייל",
    joining: "מצטרפים…",
    join: "הצטרפו לרשימה",
    fallbackError: "נסו שוב.",
    eyes: "זה לא העיניים",
    vision: "זה VISION",
    rights: "© 2026 EYEBREED™. כל הזכויות שמורות.",
    powered: "עיצוב ופיתוח על ידי EASYPASSPROJECTS ©",
    successTitle: "אתם ברשימה",
    successBody: "בדקו את האימייל שלכם לאישור.",
    accept: "אישור",
  },
} as const;

export function PreorderWaitlist() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const copy = translations[language];
  const hebrew = language === "he";

  useEffect(() => {
    const saved = window.localStorage.getItem("eyebreed-language");
    if (saved === "he" || saved === "en") setLanguage(saved);
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStatus("idle");
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [status]);

  function chooseLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("eyebreed-language", nextLanguage);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || copy.fallbackError);
      setStatus("success");
      setMessage("");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
    }
  }

  return (
    <main
      dir={hebrew ? "rtl" : "ltr"}
      className="relative isolate min-h-svh overflow-hidden bg-[#25130e] text-[#f5eee4]"
    >
      <Image
        src="/hero-mobile.webp"
        alt="Two EYEBREED models wearing the Vision of Life collection"
        fill
        priority
        sizes="(max-width: 767px) 100vw, 1px"
        className="-z-30 object-cover object-center md:hidden"
      />
      <Image
        src="/hero-wide.jpg"
        alt="Two EYEBREED models wearing the Vision of Life collection"
        fill
        priority
        sizes="(min-width: 768px) 100vw, 1px"
        className="-z-30 hidden object-cover object-center md:block"
      />
      <div className="absolute inset-0 -z-20 bg-[#1e0e09]/35" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(18,7,4,.2)_58%,rgba(12,5,3,.66)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-2 font-display text-xs tracking-[.18em] text-white/75 backdrop-blur-md sm:right-7 sm:top-6 sm:text-sm">
        <button
          type="button"
          onClick={() => chooseLanguage("en")}
          aria-pressed={!hebrew}
          className={!hebrew ? "text-white" : "transition hover:text-white"}
        >
          EN
        </button>
        <span className="text-white/30">|</span>
        <button
          type="button"
          onClick={() => chooseLanguage("he")}
          aria-pressed={hebrew}
          className={hebrew ? "text-white" : "transition hover:text-white"}
        >
          עב
        </button>
      </div>

      <div className="mx-auto flex min-h-svh w-full max-w-[1500px] flex-col items-center px-5 pb-7 pt-6 text-center sm:px-8 sm:pb-9 sm:pt-8 lg:px-12">
        <header className="flex flex-col items-center" aria-label="EYEBREED">
          <Image
            src="/logo.png"
            alt=""
            width={120}
            height={120}
            className="h-16 w-24 object-contain brightness-0 invert sm:h-20 sm:w-28"
          />
          <span className="-mt-2 font-display text-xl tracking-[.34em] sm:text-2xl">
            EYEBREED
          </span>
        </header>

        <section className="my-auto flex w-full max-w-[760px] flex-col items-center py-7 sm:py-10">
          <div className="relative w-full pt-8 sm:pt-10">
            <svg
              aria-hidden="true"
              viewBox="0 0 620 94"
              preserveAspectRatio="none"
              className="absolute left-1/2 top-0 h-14 w-[84%] -translate-x-1/2 overflow-visible sm:h-20"
            >
              <path
                d="M12 82 C 92 0, 184 8, 260 50 S 390 76, 456 35 S 554 12, 608 52"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <h1 className="relative inline-flex items-start font-display text-[clamp(5.2rem,18vw,12.5rem)] font-medium leading-[.64] tracking-[-.075em] drop-shadow-[0_3px_18px_rgba(0,0,0,.45)]">
              VISION
            </h1>
          </div>

          <div className="mt-5 flex w-[min(92%,500px)] items-center gap-5 sm:mt-8">
            <span className="h-px flex-1 bg-current/75" />
            <p className="font-display text-2xl tracking-[.46em] sm:text-4xl">
              OF LIFE
            </p>
            <span className="h-px flex-1 bg-current/75" />
          </div>
          <p className="mt-5 text-xl tracking-[.15em] sm:mt-7 sm:text-2xl">
            {copy.preorder}
          </p>

          <form
            onSubmit={submit}
            className="mt-6 w-full max-w-[590px] space-y-2.5 sm:mt-7"
          >
            <label className="sr-only" htmlFor="preorder-email">
              {copy.emailLabel}
            </label>
            <div className="flex min-h-16 items-center rounded-2xl border border-white/70 bg-black/25 px-5 shadow-[0_12px_45px_rgba(0,0,0,.18)] backdrop-blur-sm sm:min-h-[74px] sm:px-7">
              <input
                id="preorder-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={copy.emailPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent font-display text-xl tracking-[.04em] text-white outline-none ring-0 placeholder:text-white/65 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:text-2xl"
              />
              <Mail
                aria-hidden="true"
                className={`${hebrew ? "mr-4" : "ml-4"} size-6 shrink-0`}
                strokeWidth={1.4}
              />
            </div>
            <div className="relative">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="vision-join-button group flex min-h-16 w-full items-center justify-center gap-5 rounded-2xl bg-[#f3ebdf] px-6 font-display text-lg font-semibold tracking-[.32em] text-[#17100d] shadow-[0_12px_45px_rgba(0,0,0,.24)] transition duration-300 hover:bg-white focus-visible:outline-white disabled:cursor-wait disabled:opacity-70 sm:min-h-[74px] sm:text-2xl"
              >
                <span>
                  {status === "submitting" ? copy.joining : copy.join}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className={`size-6 transition-transform duration-300 ${hebrew ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`}
                  strokeWidth={1.5}
                />
              </button>
              {status === "idle" && (
                <div
                  aria-hidden="true"
                  className="vision-demo-cursor pointer-events-none absolute -bottom-7 right-0 z-10 h-16 w-16 text-[#17100d] sm:-bottom-8 sm:-right-3"
                >
                  <span className="vision-click-ray vision-click-ray--one" />
                  <span className="vision-click-ray vision-click-ray--two" />
                  <span className="vision-click-ray vision-click-ray--three" />
                  <MousePointer2 className="absolute bottom-0 right-0 size-11 fill-white stroke-[2.4] drop-shadow-[2px_3px_0_rgba(0,0,0,.7)] sm:size-12" />
                </div>
              )}
            </div>
            <p
              aria-live="polite"
              className={`min-h-5 pt-1 text-[11px] tracking-[.16em] ${status === "error" ? "text-red-200" : "text-white/85"}`}
            >
              {message}
            </p>
          </form>
        </section>

        <footer className="flex flex-col items-center text-[10px] leading-5 tracking-[.38em] sm:text-xs sm:leading-6">
          <p>{copy.eyes}</p>
          <p>{copy.vision}</p>
          <div className="mx-auto mt-16 flex max-w-[1600px] flex-col items-center justify-center gap-3 border-t border-white/15 pt-6 text-[9px] tracking-wider text-white/75 sm:flex-row sm:justify-between">
            <span>{copy.rights}</span>
            <PaymentSupport />
            <span className="flex items-center justify-center gap-2 text-center sm:justify-end">
              {copy.powered}
              <Image
                src="/easyPassProjects.png"
                alt="EASYPASSPROJECTS"
                width={20}
                height={20}
              />
            </span>
          </div>
        </footer>
      </div>

      {status === "success" && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#120906]/45 px-4 py-8 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setStatus("idle");
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-[470px] rounded-[18px] border border-[#6b402b]/70 bg-[#f3ebdf] px-6 py-7 text-center text-[#28170f] shadow-[0_24px_75px_rgba(0,0,0,.38)] sm:px-10 sm:py-9"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#5a311f] sm:size-16">
              <Check
                aria-hidden="true"
                className="size-7 sm:size-8"
                strokeWidth={1.4}
              />
            </div>
            <h2
              id="success-title"
              className="mt-5 font-display text-[clamp(1.9rem,6vw,3rem)] font-medium leading-none tracking-[-.025em]"
            >
              {copy.successTitle}
            </h2>
            <span className="mx-auto mt-5 block h-px w-9 bg-[#83583e]/55" />
            <p className="mt-4 font-display text-base sm:text-xl">
              {copy.successBody}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setStatus("idle")}
              className="group mt-6 flex min-h-14 w-full items-center justify-center gap-4 rounded-xl bg-[#321c12] px-5 font-display text-base tracking-[.25em] text-[#f7eee3] transition duration-300 hover:bg-[#1d100b] focus-visible:outline-[#321c12] sm:text-lg"
            >
              <span>{copy.accept}</span>
              <ArrowRight
                aria-hidden="true"
                className={`size-5 transition-transform ${hebrew ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                strokeWidth={1.4}
              />
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
