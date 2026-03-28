import LoginForm from "./LoginForm";

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { next, error: errorParam } = await searchParams;
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/entries";

  let decodedParam: string | undefined;
  if (errorParam && errorParam !== "auth_missing_code") {
    try {
      decodedParam = decodeURIComponent(errorParam);
    } catch {
      decodedParam = errorParam;
    }
  }

  const urlError =
    errorParam === "auth_missing_code"
      ? "auth_missing_code"
      : decodedParam ?? undefined;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-8">
      <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-9 shadow-sm sm:p-11">
        <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
          sign in
        </p>
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900">
          로그인
        </h1>
        <LoginForm nextPath={nextPath} urlError={urlError} />
      </div>
    </div>
  );
}
