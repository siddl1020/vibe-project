import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 sm:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white px-10 py-14 text-center shadow-sm sm:px-12 sm:py-16">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-400">
          personal journal
        </p>
        <h1 className="mt-5 text-[1.65rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl sm:leading-tight">
          나만의 감정을
          <br />
          기록해 보세요
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm font-normal leading-relaxed text-slate-500 sm:text-[0.95rem]">
          오늘의 무드와 생각을 차분히 남기고, 나만의 이야기를 쌓아 가세요.
        </p>
        <Link
          href="/entries"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-purple-700 px-9 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-800"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
