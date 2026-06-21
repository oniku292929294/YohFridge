import { useState } from "react";
import { useListEvents, useGetSummary } from "@workspace/api-client-react";
import { Clock } from "@/components/clock";
import { StatusBadges } from "@/components/status-badges";
import { EventList } from "@/components/event-list";
import { TabBar } from "@/components/tab-bar";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"task" | "shopping">("task");
  
  const { data: events = [] } = useListEvents();
  const { data: summary } = useGetSummary();

  const filteredEvents = events.filter(e => e.genre === activeTab);
  
  return (
    <div className="min-h-[100dvh] w-full bg-[#FAFAFA] relative overflow-x-hidden text-[#1C1C1E] selection:bg-black/10 font-sans">
      {/* Blurry blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[70vw] h-[70vw] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen px-6 pt-16 pb-32 flex flex-col">
        
        {/* Header */}
        <header className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
          <Clock />
          <StatusBadges />
        </header>

        {/* List Area */}
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-150 fill-mode-both">
          <EventList events={filteredEvents} genre={activeTab} />
        </div>

      </main>

      {/* Tab Bar */}
      <TabBar 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        activeCount={summary?.active_tasks || 0} 
      />
    </div>
  );
}
