"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupState = { error?: string } | null;

/**
 * 이메일 확인 리다이렉트용. 요청 헤더(Host/X-Forwarded-*)는 신뢰하지 않고
 * 환경 변수만 사용한다 (호스트 헤더 오염 방지).
 */
function getTrustedAppOrigin(): string | null {
  const raw =
    process.env.APP_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    "";
  if (!raw) {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
    return null;
  }
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return null;
    }
    return u.origin;
  } catch {
    return null;
  }
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 합니다." };
  }

  const origin = getTrustedAppOrigin();
  if (!origin) {
    return {
      error:
        "앱 기준 주소가 설정되지 않았습니다. APP_URL(또는 NEXT_PUBLIC_APP_URL)을 확인해 주세요.",
    };
  }

  const supabase = await createClient();
  const emailRedirectTo = `${origin}/auth/callback`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
