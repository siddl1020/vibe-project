"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseMood } from "@/lib/entries";

export type CreateEntryState = { error?: string } | null;

export async function createEntry(
  _prev: CreateEntryState,
  formData: FormData,
): Promise<CreateEntryState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
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

  const { error } = await supabase.from("entries").insert({
    user_id: user.id,
    title,
    content,
    mood,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/entries");
  redirect("/entries");
}
