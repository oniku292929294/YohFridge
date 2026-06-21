import { Event } from "@workspace/api-client-react";
import { useUpdateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function EventCard({ event }: { event: Event }) {
  const queryClient = useQueryClient();
  const updateEvent = useUpdateEvent();

  const toggleDone = () => {
    updateEvent.mutate(
      { id: event.id, data: { done: !event.done } },
      {
        onSuccess: () => {
          // Ideally use setQueryData to avoid refetch loops, but invalidate is fine for simple app
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        },
      }
    );
  };

  const accentColor = event.accent_color || "#a7c7e7"; // Soft blue default

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: event.done ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "glass-panel flex items-center p-4 relative overflow-hidden group transition-all duration-300",
        event.done && "bg-white/20 border-white/30 shadow-none"
      )}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 bg-opacity-80" 
        style={{ backgroundColor: event.done ? "transparent" : accentColor }} 
      />
      <div className="flex-1 pl-2">
        <h3 className={cn("text-base font-medium text-[#1C1C1E] transition-all", event.done && "line-through text-gray-500 font-normal")}>
          {event.title}
        </h3>
        {event.detail && (
          <p className="text-xs text-gray-500 mt-1 font-light">{event.detail}</p>
        )}
      </div>
      <button 
        onClick={toggleDone}
        className="ml-4 p-2 rounded-full hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-black/5"
      >
        {event.done ? (
          <Check className="w-6 h-6 text-gray-400" strokeWidth={2} />
        ) : (
          <Circle className="w-6 h-6 text-gray-300 hover:text-gray-500 transition-colors" strokeWidth={1.5} />
        )}
      </button>
    </motion.div>
  );
}
