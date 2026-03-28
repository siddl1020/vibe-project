"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseMood } from "@/lib/entries";

export type UpdateEntryState = { error?: string } | null;

export async function updateEntry(
  _prev: UpdateEntryState,
  formData: FormData,
): Promise<UpdateEntryState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "일기 정보가 올바르지 않습니다." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const mood = parseMood(formData.get("mood"));

  if (!title) {
    return { error: "제목을 입력해 주세요." };
  }
  if (!content) {
    return { error: "본문을 입력해 주세요." };
  }
  if (!mood) {
    return { error: "기분을 선택해 주세요." };
  }

  const { error, data } = await supabase
    .from("entries")
    .update({ title, content, mood })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "일기를 찾을 수 없거나 수정할 권한이 없습니다." };
  }

  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
  redirect(`/entries/${id}`);
}
