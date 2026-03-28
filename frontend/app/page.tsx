import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          나만의 일기장
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          하루의 감정과 이야기를 기록하세요.
          <br />
          당신만의 소중한 기록이 쌓여갑니다.
        </p>
        <Link
          href="/entries"
          className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
