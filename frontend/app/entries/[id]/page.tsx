import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  moodEmoji,
  moodLabel,
  formatDateTime,
  moodBadgeClass,
  moodArticleTopClass,
} from "@/lib/utils";
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
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
      <Link
        href="/entries"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-purple-700"
      >
        ← 목록으로
      </Link>

      <article
        className={`mt-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10 ${moodArticleTopClass[entry.mood]}`}
      >
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {entry.title}
          </h1>
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${moodBadgeClass[entry.mood]}`}
            title={moodLabel[entry.mood]}
          >
            {moodEmoji[entry.mood]}
          </span>
        </div>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-500">
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

        <div className="mt-8 whitespace-pre-wrap leading-[1.75] text-slate-700">
          {entry.content}
        </div>
      </article>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-10">
        <Link
          href={`/entries/${entry.id}/edit`}
          className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800"
        >
          수정
        </Link>
        <DeleteButton entryId={entry.id} />
      </div>
    </div>
  );
}
