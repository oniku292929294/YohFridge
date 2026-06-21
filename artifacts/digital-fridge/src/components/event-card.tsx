import { cn } from "@/lib/utils";
import type { FridgeItem } from "@/lib/fridge-items";

const ACCENT_MAP: Record<string, string> = {
  pink: "#f9a8d4",
  rose: "#f9a8d4",
  orange: "#fdba74",
  amber: "#fcd34d",
  blue: "#93c5fd",
  teal: "#5eead4",
  purple: "#c4b5fd",
  green: "#86efac",
};

function accentDotColor(accent: string | null | undefined): string {
  if (!accent) return "#93c5fd";
  return ACCENT_MAP[accent.toLowerCase()] ?? accent;
}

interface EventCardProps {
  item: FridgeItem;
  onToggle: (id: number, done: boolean) => void;
  isPending?: boolean;
}

export function EventCard({ item, onToggle, isPending }: EventCardProps) {
  const dotColor = accentDotColor(item.accent_color);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200",
        "bg-white/15 backdrop-blur-xl border border-white/30",
        item.done ? "opacity-40" : "opacity-100"
      )}
    >
      <span
        className="shrink-0 w-2 h-2 rounded-full mt-0.5 transition-colors duration-200"
        style={{ backgroundColor: item.done ? "#d1d5db" : dotColor }}
      />

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-[15px] font-medium text-[#1C1C1E] leading-snug truncate transition-all duration-200",
            item.done && "line-through text-gray-400 font-normal"
          )}
        >
          {item.title}
        </h3>
        {item.detail && (
          <p className="text-xs text-gray-400 mt-0.5 font-light truncate">{item.detail}</p>
        )}
      </div>

      <button
        onClick={() => onToggle(item.id, !item.done)}
        aria-label={item.done ? "Mark incomplete" : "Mark complete"}
        disabled={isPending}
        className="shrink-0 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150 active:scale-90 focus:outline-none disabled:opacity-50"
        style={{
          borderColor: item.done ? "#d1d5db" : dotColor,
          backgroundColor: item.done ? "rgba(243,244,246,0.6)" : "transparent",
        }}
      >
        {item.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
