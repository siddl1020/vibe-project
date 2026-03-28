export default function EntriesLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex animate-pulse items-center justify-between">
        <div className="h-8 w-32 rounded bg-gray-200" />
        <div className="h-9 w-28 rounded-lg bg-gray-200" />
      </div>
      <ul className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="h-24 animate-pulse rounded-lg border border-gray-100 bg-white"
          />
        ))}
      </ul>
    </div>
  );
}
