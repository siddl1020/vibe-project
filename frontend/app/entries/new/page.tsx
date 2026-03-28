import NewEntryForm from "./NewEntryForm";

export default function NewEntryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        new entry
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        새 일기 쓰기
      </h1>
      <NewEntryForm />
    </div>
  );
}
