import { useState } from "react";
import { Plus } from "lucide-react";
import { EventCard } from "./event-card";
import type { FridgeCategory, FridgeItem } from "@/lib/fridge-items";

interface EventListProps {
  items: FridgeItem[];
  category: FridgeCategory;
  onAdd: (title: string, category: FridgeCategory) => Promise<void>;
  onToggle: (id: number, done: boolean) => void;
  isAdding?: boolean;
}

export function EventList({ items, category, onAdd, onToggle, isAdding }: EventListProps) {
  const [newTitle, setNewTitle] = useState("");

  const activeItems = items.filter((i) => !i.done);
  const doneItems = items.filter((i) => i.done);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    await onAdd(trimmed, category);
    setNewTitle("");
  };

  return (
    <div className="flex flex-col gap-3 pb-28">
      {activeItems.map((item) => (
        <EventCard key={item.id} item={item} onToggle={onToggle} />
      ))}

      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 mt-1"
      >
        <button
          type="submit"
          disabled={isAdding || !newTitle.trim()}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={category === "task" ? "Add task…" : "Add item…"}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#1C1C1E] placeholder:text-gray-400 font-light"
          disabled={isAdding}
        />
      </form>

      {doneItems.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gray-200/60" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Completed
            </span>
            <div className="h-px flex-1 bg-gray-200/60" />
          </div>
          <div className="flex flex-col gap-3">
            {doneItems.map((item) => (
              <EventCard key={item.id} item={item} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
