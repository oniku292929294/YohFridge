import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabBarProps {
  activeTab: "task" | "shopping";
  onChange: (tab: "task" | "shopping") => void;
  activeCount: number;
}

export function TabBar({ activeTab, onChange, activeCount }: TabBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
      <div className="glass-panel p-2 flex relative rounded-full">
        <button
          onClick={() => onChange("task")}
          className={cn(
            "flex-1 py-3 text-sm font-semibold tracking-wide relative z-10 transition-colors duration-300 rounded-full flex items-center justify-center gap-1.5",
            activeTab === "task" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          FRIDGE
          {activeCount > 0 && activeTab !== "task" && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-orange-400 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onChange("shopping")}
          className={cn(
            "flex-1 py-3 text-sm font-semibold tracking-wide relative z-10 transition-colors duration-300 rounded-full",
            activeTab === "shopping" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
          )}
        >
          SHOPPING
        </button>
        
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute top-2 bottom-2 w-[calc(50%-8px)] bg-white/60 rounded-full shadow-sm"
          animate={{
            left: activeTab === "task" ? "8px" : "calc(50% + 4px)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
