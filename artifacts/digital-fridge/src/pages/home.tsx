import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock } from "@/components/clock";
import { StatusBadges } from "@/components/status-badges";
import { EventList } from "@/components/event-list";
import { TabBar } from "@/components/tab-bar";
import {
  fetchFridgeItems,
  insertFridgeItem,
  updateFridgeItem,
  type FridgeCategory,
} from "@/lib/fridge-items";

const FRIDGE_ITEMS_KEY = ["fridge_items"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<FridgeCategory>("task");
  const queryClient = useQueryClient();

  const { data: allItems = [] } = useQuery({
    queryKey: FRIDGE_ITEMS_KEY,
    queryFn: fetchFridgeItems,
  });

  const addMutation = useMutation({
    mutationFn: (vars: { title: string; category: FridgeCategory }) =>
      insertFridgeItem({ title: vars.title, category: vars.category }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIDGE_ITEMS_KEY }),
  });

  const toggleMutation = useMutation({
    mutationFn: (vars: { id: number; done: boolean }) =>
      updateFridgeItem(vars.id, { done: vars.done }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIDGE_ITEMS_KEY }),
  });

  const handleAdd = async (title: string, category: FridgeCategory) => {
    await addMutation.mutateAsync({ title, category });
  };

  const handleToggle = (id: number, done: boolean) => {
    toggleMutation.mutate({ id, done });
  };

  const filteredItems = allItems.filter((i) => i.category === activeTab);
  const activeTaskCount = allItems.filter((i) => i.category === "task" && !i.done).length;

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAFAFA] relative overflow-x-hidden text-[#1C1C1E] selection:bg-black/10 font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[70vw] h-[70vw] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-md mx-auto min-h-screen px-6 pt-16 pb-32 flex flex-col">
        <header className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
          <Clock />
          <StatusBadges />
        </header>

        <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-150 fill-mode-both">
          <EventList
            items={filteredItems}
            category={activeTab}
            onAdd={handleAdd}
            onToggle={handleToggle}
            isAdding={addMutation.isPending}
          />
        </div>
      </main>

      <TabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        activeCount={activeTaskCount}
      />
    </div>
  );
}
