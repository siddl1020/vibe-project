import { entryListCardAccent } from "@/lib/utils";

export default function EntriesLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
      <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-3 w-16 rounded bg-slate-200" />
          <div className="mt-2 h-8 w-36 rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
      </div>
      <ul className="mt-10 space-y-4">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className={`h-28 animate-pulse rounded-2xl ${entryListCardAccent(i)}`}
          />
        ))}
      </ul>
    </div>
  );
}
