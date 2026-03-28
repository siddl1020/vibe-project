import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Entry } from "@/types";
import EditEntryForm from "./EditEntryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: Props) {
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

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        edit
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        일기 수정
      </h1>
      <EditEntryForm entry={row as Entry} />
    </div>
  );
}
