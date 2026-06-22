import { supabase } from "./supabase";

export type ScheduleSource = "kindergarten" | "calendar_screenshot" | "manual";

export interface ScheduleItem {
  id: number;
  date: string;
  title: string;
  detail: string | null;
  source: ScheduleSource;
  emoji: string | null;
  created_at: string;
}

export async function fetchUpcomingSchedule(): Promise<ScheduleItem[]> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("kndr_schedule")
    .select("id, date, title, detail, source, emoji, created_at")
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data as ScheduleItem[];
}
