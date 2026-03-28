import type { Entry } from "@/types";

export const ENTRY_MOODS = [
  "happy",
  "sad",
  "angry",
  "neutral",
  "excited",
] as const satisfies readonly Entry["mood"][];

/** LIKE 패턴용 — %, _, \ 리터럴 처리 */
export function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/** PostgREST `filter` 값에 공백·특수문자가 있을 때 이중따옴표로 감쌈 */
export function quotePostgrestValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** 콤마는 `.or()` 구문과 충돌하므로 공백으로 치환 */
export function normalizeSearchQuery(raw: string | undefined): string {
  return raw?.trim().replace(/,/g, " ") ?? "";
}

export function parseMoodParam(
  raw: string | undefined,
): Entry["mood"] | undefined {
  if (!raw || raw === "all") return undefined;
  return (ENTRY_MOODS as readonly string[]).includes(raw)
    ? (raw as Entry["mood"])
    : undefined;
}
