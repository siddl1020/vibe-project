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
