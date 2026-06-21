import { supabase } from "./supabase";

export type FridgeCategory = "task" | "shopping";

export interface FridgeItem {
  id: number;
  title: string;
  detail: string | null;
  category: FridgeCategory;
  done: boolean;
  accent_color: string | null;
  created_at: string;
}

export interface CreateFridgeItem {
  title: string;
  detail?: string;
  category?: FridgeCategory;
  accent_color?: string;
}

export interface UpdateFridgeItem {
  title?: string;
  detail?: string;
  category?: FridgeCategory;
  done?: boolean;
  accent_color?: string;
}

function detectCategory(title: string, explicit?: FridgeCategory): FridgeCategory {
  if (title.includes("買う")) return "shopping";
  return explicit ?? "task";
}

export async function fetchFridgeItems(): Promise<FridgeItem[]> {
  const { data, error } = await supabase
    .from("fridge_items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as FridgeItem[];
}

export async function insertFridgeItem(input: CreateFridgeItem): Promise<FridgeItem> {
  const category = detectCategory(input.title, input.category);
  const { data, error } = await supabase
    .from("fridge_items")
    .insert([{ ...input, category, done: false }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FridgeItem;
}

export async function updateFridgeItem(id: number, updates: UpdateFridgeItem): Promise<FridgeItem> {
  const { data, error } = await supabase
    .from("fridge_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FridgeItem;
}

export async function deleteFridgeItem(id: number): Promise<void> {
  const { error } = await supabase
    .from("fridge_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
