import type { Entry } from "@/types";

export const MOODS: Entry["mood"][] = [
  "happy",
  "sad",
  "angry",
  "neutral",
  "excited",
];

export function parseMood(
  value: FormDataEntryValue | null,
): Entry["mood"] | null {
  const s = String(value ?? "");
  return (MOODS as readonly string[]).includes(s)
    ? (s as Entry["mood"])
    : null;
}
