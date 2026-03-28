import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-[4.25rem] max-w-5xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="text-[1.05rem] font-semibold tracking-tight text-slate-900 sm:text-lg"
        >
          나만의 일기장
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/entries"
                className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 ring-1 ring-sky-100 transition-colors hover:bg-sky-100/80"
              >
                내 일기
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
