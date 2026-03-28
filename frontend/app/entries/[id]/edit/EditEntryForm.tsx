"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { updateEntry, type UpdateEntryState } from "./actions";
import { MOODS } from "@/lib/entries";
import { moodEmoji, moodLabel } from "@/lib/utils";
import type { Entry } from "@/types";

interface Props {
  entry: Entry;
}

export default function EditEntryForm({ entry }: Props) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState<Entry["mood"]>(entry.mood);

  const [state, formAction, pending] = useActionState<
    UpdateEntryState,
    FormData
  >(updateEntry, null);

  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state?.error]);

  return (
    <form
      action={formAction}
      className="mt-10 space-y-6 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm sm:p-9"
    >
      <input type="hidden" name="id" value={entry.id} />

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
          htmlFor="title"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          본문
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
          className="mt-2 block w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
        />
      </div>

      <div>
        <label
          htmlFor="mood"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          기분
        </label>
        <select
          id="mood"
          name="mood"
          required
          value={mood}
          onChange={(e) => setMood(e.target.value as Entry["mood"])}
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
        >
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {moodEmoji[m]} {moodLabel[m]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-purple-700 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800 disabled:opacity-60"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
        <Link
          href={`/entries/${entry.id}`}
          className="rounded-xl border border-slate-200 bg-white px-7 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
