export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: "happy" | "sad" | "angry" | "neutral" | "excited";
  created_at: string;
  updated_at: string;
}

export type EntryListItem = Pick<Entry, "id" | "title" | "mood" | "created_at">;

export interface ActionResult {
  error?: string;
}
