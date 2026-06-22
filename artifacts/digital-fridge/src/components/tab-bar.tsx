import { cn } from "@/lib/utils";

interface TabBarProps {
  activeTab: "task" | "shopping";
  onChange: (tab: "task" | "shopping") => void;
  activeCount: number;
}

export function TabBar({ activeTab, onChange, activeCount }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-2 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-6 px-8 py-3 rounded-full bg-white/30 backdrop-blur-xl border border-white/40">
        <button
          onClick={() => onChange("task")}
          className={cn(
            "text-[13px] font-semibold tracking-widest uppercase transition-colors duration-150 flex items-center gap-1.5",
            activeTab === "task" ? "text-[#1C1C1E]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Fridge
          {activeCount > 0 && activeTab !== "task" && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-400 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-gray-300 text-sm select-none">·</span>
        <button
          onClick={() => onChange("shopping")}
          className={cn(
            "text-[13px] font-semibold tracking-widest uppercase transition-colors duration-150",
            activeTab === "shopping" ? "text-[#1C1C1E]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Shopping
        </button>
      </div>
    </div>
  );
}
