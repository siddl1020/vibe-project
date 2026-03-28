"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { login, type LoginState } from "./actions";

interface Props {
  nextPath: string;
  urlError?: string;
}

export default function LoginForm({ nextPath, urlError }: Props) {
  const [state, formAction, pending] = useActionState<
    LoginState,
    FormData
  >(login, null);

  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {urlError ? (
        <div
          className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900"
          role="alert"
        >
          {urlError}
        </div>
      ) : null}

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
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
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
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>

      <p className="pt-1 text-center text-sm text-slate-500">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-semibold text-purple-700 underline decoration-purple-200 underline-offset-4 hover:text-purple-800"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
