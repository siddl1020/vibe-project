import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  moodEmoji,
  moodLabel,
  formatDate,
  moodBadgeClass,
  entryListCardAccent,
} from "@/lib/utils";
import type { EntryListItem } from "@/types";

export default async function EntriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let entries: EntryListItem[] = [];
  if (user) {
    const { data, error } = await supabase
      .from("entries")
      .select("id, title, mood, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      entries = data as EntryListItem[];
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            journal
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            내 일기
          </h1>
        </div>
        <Link
          href="/entries/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          새 일기 쓰기
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-slate-100 bg-white p-14 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            아직 작성한 일기가 없습니다.
          </p>
          <Link
            href="/entries/new"
            className="mt-5 inline-block text-sm font-semibold text-purple-700 underline decoration-purple-200 underline-offset-4 hover:text-purple-800"
          >
            첫 번째 일기를 작성해 보세요 →
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <Link
                href={`/entries/${entry.id}`}
                className={`block rounded-2xl p-6 transition-shadow hover:shadow-md sm:p-7 ${entryListCardAccent(index)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-slate-900">
                      {entry.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${moodBadgeClass[entry.mood]}`}
                    title={moodLabel[entry.mood]}
                  >
                    {moodEmoji[entry.mood]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
