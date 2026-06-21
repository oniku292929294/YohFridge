import { Event } from "@workspace/api-client-react";
import { useUpdateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: event.done ? 0.45 : 1, y: 0 }}
      exit={{ x: 56, opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "glass-card flex items-center gap-3 px-4 py-3.5",
        event.done && "shadow-none"
      )}
    >
      <span
        className="shrink-0 w-2 h-2 rounded-full mt-0.5"
        style={{ backgroundColor: event.done ? "#d1d5db" : dotColor }}
      />

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-[15px] font-medium text-[#1C1C1E] leading-snug truncate transition-all",
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
        className="shrink-0 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all active:scale-90 focus:outline-none"
        style={{
          borderColor: event.done ? "#d1d5db" : dotColor,
          backgroundColor: event.done ? "#f3f4f6" : "transparent",
        }}
      >
        {event.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
