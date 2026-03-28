"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { createEntry, type CreateEntryState } from "./actions";
import { MOODS } from "@/lib/entries";
import { moodEmoji, moodLabel } from "@/lib/utils";
import type { Entry } from "@/types";

export default function NewEntryForm() {
  const [state, formAction, pending] = useActionState<
    CreateEntryState,
    FormData
  >(createEntry, null);

  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="mt-6 space-y-5">
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
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          disabled={pending}
          placeholder="오늘의 제목"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          본문
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          disabled={pending}
          placeholder="오늘 하루를 기록해 보세요..."
          className="mt-1 block w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-gray-700"
        >
          기분
        </label>
        <select
          id="mood"
          name="mood"
          required
          defaultValue="neutral"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100"
        >
          {MOODS.map((m: Entry["mood"]) => (
            <option key={m} value={m}>
              {moodEmoji[m]} {moodLabel[m]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
        <Link
          href="/entries"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
