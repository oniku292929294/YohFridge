import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingSchedule, type ScheduleItem } from "@/lib/schedule";

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

function DayLabel({ days }: { days: number }) {
  if (days === 0) return <span className="text-rose-400 font-semibold">今日</span>;
  if (days === 1) return <span className="text-amber-500 font-semibold">明日</span>;
  return <span className="text-gray-400">{days}日後</span>;
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
      <span className="shrink-0 text-[10px] text-gray-400 bg-gray-100/60 border border-gray-200/60 rounded-full px-2 py-0.5 mt-0.5 font-medium">
        {SOURCE_LABEL[item.source] ?? item.source}
      </span>
    </div>
  );
}

export function ScheduleList() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["kndr_schedule"],
    queryFn: fetchUpcomingSchedule,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 pb-28">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-16 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-sm text-gray-400 font-light">
        データの取得に失敗しました
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-3xl mb-3">📅</p>
        <p className="text-sm text-gray-400 font-light">今後の予定はありません</p>
      </div>
    );
  }

  // Group by date
  const groups = items.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    (acc[item.date] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 pb-28">
      {Object.entries(groups).map(([date, group]) => {
        const days = daysFromToday(date);
        return (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium text-gray-600">{formatDate(date)}</span>
              <span className="text-[11px]">
                <DayLabel days={days} />
              </span>
              <div className="h-px flex-1 bg-gray-200/60" />
            </div>
            <div className="flex flex-col gap-3">
              {group.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
