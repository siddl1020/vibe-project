import NewEntryForm from "./NewEntryForm";

export default function NewEntryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">새 일기 쓰기</h1>
      <NewEntryForm />
    </div>
  );
}
