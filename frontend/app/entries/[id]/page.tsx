import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { moodEmoji, moodLabel, formatDateTime } from "@/lib/utils";
import type { Entry } from "@/types";
import DeleteButton from "./DeleteButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EntryDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: row, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const entry = row as Entry;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        href="/entries"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← 목록으로
      </Link>

      <article className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>
          <span className="shrink-0 text-2xl" title={moodLabel[entry.mood]}>
            {moodEmoji[entry.mood]}
          </span>
        </div>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
          <div>
            <dt className="sr-only">기분</dt>
            <dd>{moodLabel[entry.mood]}</dd>
          </div>
          <div>
            <dt className="sr-only">작성일</dt>
            <dd>작성: {formatDateTime(entry.created_at)}</dd>
          </div>
          {entry.updated_at !== entry.created_at && (
            <div>
              <dt className="sr-only">수정일</dt>
              <dd>수정: {formatDateTime(entry.updated_at)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
          {entry.content}
        </div>
      </article>

      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
        <Link
          href={`/entries/${entry.id}/edit`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          수정
        </Link>
        <DeleteButton entryId={entry.id} />
      </div>
    </div>
  );
}
