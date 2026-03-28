import { Entry } from "@/types";

export const moodEmoji: Record<Entry["mood"], string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  excited: "🤩",
};

export const moodLabel: Record<Entry["mood"], string> = {
  happy: "행복",
  sad: "슬픔",
  angry: "화남",
  neutral: "보통",
  excited: "신남",
};

/** 기분별 뱃지 — 파스텔 pill (대시보드 목업 톤) */
export const moodBadgeClass: Record<Entry["mood"], string> = {
  happy:
    "border border-sky-100 bg-sky-50 text-lg text-sky-800 shadow-sm",
  sad: "border border-sky-200 bg-sky-100 text-lg text-sky-900 shadow-sm",
  angry:
    "border border-purple-100 bg-purple-100 text-lg text-purple-900 shadow-sm",
  neutral:
    "border border-purple-50 bg-purple-50 text-lg text-purple-800 shadow-sm",
  excited:
    "border border-violet-100 bg-violet-100 text-lg text-violet-900 shadow-sm",
};

/** 목록 카드 — 화이트 카드 + 은은한 좌측 악센트 */
export const entryListStripeClasses: readonly string[] = [
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-purple-400",
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-sky-400",
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-violet-400",
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-purple-300",
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-sky-300",
  "border border-slate-100 bg-white shadow-sm border-l-[3px] border-l-violet-300",
] as const;

export function entryListCardAccent(index: number): string {
  const stripes = entryListStripeClasses;
  return stripes[index % stripes.length] ?? stripes[0];
}

/** 상세 본문 카드 상단 포인트 */
export const moodArticleTopClass: Record<Entry["mood"], string> = {
  happy: "border-t-[3px] border-t-sky-300",
  sad: "border-t-[3px] border-t-sky-400",
  angry: "border-t-[3px] border-t-purple-400",
  neutral: "border-t-[3px] border-t-purple-300",
  excited: "border-t-[3px] border-t-violet-400",
};

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
