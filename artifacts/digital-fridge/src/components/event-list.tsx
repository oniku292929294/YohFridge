import { useState } from "react";
import { Plus } from "lucide-react";
import { EventCard } from "./event-card";
import type { FridgeCategory, FridgeItem } from "@/lib/fridge-items";
import type { ScheduleItem } from "@/lib/schedule";

const SOURCE_LABEL: Record<string, string> = {
  kindergarten: "幼稚園",
  calendar_screenshot: "カレンダー",
  manual: "手入力",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function daysFromToday(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function DayChip({ days }: { days: number }) {
  if (days === 0)
    return (
      <span className="text-[10px] font-semibold text-white bg-rose-400 rounded-full px-2 py-0.5">
        今日
      </span>
    );
  if (days === 1)
    return (
      <span className="text-[10px] font-semibold text-white bg-amber-400 rounded-full px-2 py-0.5">
        明日
      </span>
    );
  return (
    <span className="text-[10px] text-gray-400 font-medium">{days}日後</span>
  );
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30">
      {item.emoji ? (
        <span className="text-xl leading-none mt-0.5 shrink-0">{item.emoji}</span>
      ) : (
        <span className="shrink-0 w-2 h-2 rounded-full bg-indigo-300 mt-2" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#1C1C1E] leading-snug">{item.title}</p>
        {item.detail && (
          <p className="text-xs text-gray-400 mt-0.5 font-light">{item.detail}</p>
        )}
      </div>
      <span className="shrink-0 text-[10px] text-gray-400 bg-gray-100/60 border border-gray-200/60 rounded-full px-2 py-0.5 mt-0.5 font-medium whitespace-nowrap">
        {SOURCE_LABEL[item.source] ?? item.source}
      </span>
    </div>
  );
}

interface EventListProps {
  items: FridgeItem[];
  scheduleItems?: ScheduleItem[];
  category: FridgeCategory;
  onAdd: (title: string, category: FridgeCategory) => Promise<void>;
  onToggle: (id: number, done: boolean) => void;
  isAdding?: boolean;
}

export function EventList({
  items,
  scheduleItems = [],
  category,
  onAdd,
  onToggle,
  isAdding,
}: EventListProps) {
  const [newTitle, setNewTitle] = useState("");

  const activeItems = items.filter((i) => !i.done);
  const doneItems = items.filter((i) => i.done);

  // Group schedule items by date
  const scheduleGroups = scheduleItems.reduce<Record<string, ScheduleItem[]>>(
    (acc, item) => {
      (acc[item.date] ??= []).push(item);
      return acc;
    },
    {}
  );
  const scheduleDates = Object.keys(scheduleGroups).sort();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    await onAdd(trimmed, category);
    setNewTitle("");
  };

  return (
    <div className="flex flex-col gap-3 pb-28">

      {/* ── 幼稚園スケジュール セクション ── */}
      {category === "task" && scheduleDates.length > 0 && (
        <div className="flex flex-col gap-4 mb-2">
          {scheduleDates.map((date) => {
            const days = daysFromToday(date);
            return (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    {formatDate(date)}
                  </span>
                  <DayChip days={days} />
                  <div className="h-px flex-1 bg-gray-200/60" />
                </div>
                <div className="flex flex-col gap-2">
                  {scheduleGroups[date].map((item) => (
                    <ScheduleCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* スケジュールとタスクの区切り */}
          {activeItems.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200/50" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                タスク
              </span>
              <div className="h-px flex-1 bg-gray-200/50" />
            </div>
          )}
        </div>
      )}

      {/* ── Fridge タスク (未完了) ── */}
      {activeItems.map((item) => (
        <EventCard key={item.id} item={item} onToggle={onToggle} />
      ))}

      {/* ── 追加フォーム ── */}
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

      {/* ── 完了済み ── */}
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
