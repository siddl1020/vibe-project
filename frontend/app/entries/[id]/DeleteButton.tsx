"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntry } from "./actions";

interface Props {
  entryId: string;
}

export default function DeleteButton({ entryId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteEntry(entryId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/entries");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "삭제 중…" : "삭제"}
      </button>
    </div>
  );
}
