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
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">일기 수정</h1>
      <EditEntryForm entry={row as Entry} />
    </div>
  );
}
