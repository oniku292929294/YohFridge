import { Event } from "@workspace/api-client-react";
import { useUpdateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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

export function EventCard({ event }: { event: Event }) {
  const queryClient = useQueryClient();
  const updateEvent = useUpdateEvent();

  const toggleDone = () => {
    updateEvent.mutate(
      { id: event.id, data: { done: !event.done } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        },
      }
    );
  };

  const dotColor = accentDotColor(event.accent_color);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200",
        "bg-white/15 backdrop-blur-xl border border-white/30",
        event.done ? "opacity-40" : "opacity-100"
      )}
    >
      <span
        className="shrink-0 w-2 h-2 rounded-full mt-0.5 transition-colors duration-200"
        style={{ backgroundColor: event.done ? "#d1d5db" : dotColor }}
      />

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-[15px] font-medium text-[#1C1C1E] leading-snug truncate transition-all duration-200",
            event.done && "line-through text-gray-400 font-normal"
          )}
        >
          {event.title}
        </h3>
        {event.detail && (
          <p className="text-xs text-gray-400 mt-0.5 font-light truncate">{event.detail}</p>
        )}
      </div>

      <button
        onClick={toggleDone}
        aria-label={event.done ? "Mark incomplete" : "Mark complete"}
        disabled={updateEvent.isPending}
        className="shrink-0 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150 active:scale-90 focus:outline-none disabled:opacity-50"
        style={{
          borderColor: event.done ? "#d1d5db" : dotColor,
          backgroundColor: event.done ? "rgba(243,244,246,0.6)" : "transparent",
        }}
      >
        {event.done && (
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
