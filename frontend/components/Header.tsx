import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          나만의 일기장
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/entries"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                내 일기
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
