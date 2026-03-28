"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signup, type SignupState } from "./actions";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState<
    SignupState,
    FormData
  >(signup, null);

  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="mt-9 space-y-5">
      {state?.error ? (
        <div
          className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm leading-relaxed text-purple-950"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="6자 이상"
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-purple-700 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800 disabled:opacity-60"
      >
        {pending ? "처리 중…" : "회원가입"}
      </button>

      <p className="pt-1 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-semibold text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-800"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
