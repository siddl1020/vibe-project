"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { login, type LoginState } from "./actions";

interface Props {
  nextPath: string;
}

export default function LoginForm({ nextPath }: Props) {
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
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {state?.error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>

      <p className="pt-2 text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-medium text-gray-900 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
