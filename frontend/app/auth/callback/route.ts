import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextRaw = url.searchParams.get("next") ?? "/entries";
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/entries";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=auth_missing_code", url.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const q = new URLSearchParams({ error: error.message });
    return NextResponse.redirect(
      new URL(`/login?${q.toString()}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
