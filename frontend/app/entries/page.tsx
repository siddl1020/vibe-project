import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { moodEmoji, moodLabel, formatDate } from "@/lib/utils";
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">내 일기</h1>
        <Link
          href="/entries/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          새 일기 쓰기
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-gray-500">아직 작성한 일기가 없습니다.</p>
          <Link
            href="/entries/new"
            className="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            첫 번째 일기를 작성해 보세요 →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/entries/${entry.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-gray-900">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-lg"
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
