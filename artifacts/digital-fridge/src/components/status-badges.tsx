import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DailyConfig {
  id: number;
  dismissal_time: string | null;
  has_lunchbox: boolean;
  has_star: boolean;
  has_dog: boolean;
  has_spiral: boolean;
}

async function fetchConfig(): Promise<DailyConfig | null> {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  const { data, error } = await supabase
    .from("daily_config")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as DailyConfig | null;
}

export function StatusBadges() {
  const { data: config } = useQuery({
    queryKey: ["daily_config"],
    queryFn: fetchConfig,
  });

  if (!config) return <div className="h-8" />;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {config.dismissal_time && (
        <span className="glass-pill">📛 {config.dismissal_time} Dismissal</span>
      )}
      {config.has_lunchbox && (
        <span className="glass-pill">🍱 Lunch Provided</span>
      )}
      {config.has_star && <span className="glass-pill">⭐</span>}
      {config.has_dog && <span className="glass-pill">🐶</span>}
      {config.has_spiral && <span className="glass-pill">🌀</span>}
    </div>
  );
}
