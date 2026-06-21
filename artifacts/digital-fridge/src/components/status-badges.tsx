import { useGetConfig } from "@workspace/api-client-react";

export function StatusBadges() {
  const { data: config } = useGetConfig();

  if (!config) return <div className="h-8" />; // placeholder

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
