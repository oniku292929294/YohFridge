import { useState } from "react";
import { Event, EventGenre } from "@workspace/api-client-react";
import { useCreateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { EventCard } from "./event-card";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface EventListProps {
  events: Event[];
  genre: EventGenre;
}

export function EventList({ events, genre }: EventListProps) {
  const [newItemTitle, setNewItemTitle] = useState("");
  const createEvent = useCreateEvent();
  const queryClient = useQueryClient();

  const activeEvents = events.filter((e) => !e.done);
  const doneEvents = events.filter((e) => e.done);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    createEvent.mutate(
      { data: { title: newItemTitle.trim(), genre } },
      {
        onSuccess: () => {
          setNewItemTitle("");
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      <AnimatePresence>
        {activeEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </AnimatePresence>

      <form onSubmit={handleAdd} className="glass-panel flex items-center p-2 mt-2">
        <button type="submit" className="p-2 text-gray-400 hover:text-gray-600 transition-colors" disabled={createEvent.isPending}>
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder={`Add new ${genre === "task" ? "task" : "shopping item"}...`}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 font-light"
          disabled={createEvent.isPending}
        />
      </form>

      {doneEvents.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Completed</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {doneEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
