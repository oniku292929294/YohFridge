import { useState } from "react";
import { Event, EventGenre } from "@workspace/api-client-react";
import { useCreateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { EventCard } from "./event-card";
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
    <div className="flex flex-col gap-3 pb-28">
      {activeEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 mt-1"
      >
        <button
          type="submit"
          disabled={createEvent.isPending || !newItemTitle.trim()}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder={genre === "task" ? "Add task…" : "Add item…"}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#1C1C1E] placeholder:text-gray-400 font-light"
          disabled={createEvent.isPending}
        />
      </form>

      {doneEvents.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gray-200/60" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Completed
            </span>
            <div className="h-px flex-1 bg-gray-200/60" />
          </div>
          <div className="flex flex-col gap-3">
            {doneEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
