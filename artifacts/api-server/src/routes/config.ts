import { Router } from "express";
import { db, dailyConfigTable, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateConfigBody } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router = Router();

async function ensureConfig() {
  const rows = await db.select().from(dailyConfigTable).limit(1);
  if (rows.length === 0) {
    const [config] = await db
      .insert(dailyConfigTable)
      .values({
        dismissal_time: "17:00",
        has_lunchbox: true,
        has_star: true,
        has_dog: false,
        has_spiral: true,
      })
      .returning();
    return config;
  }
  return rows[0];
}

router.get("/config", async (_req, res) => {
  const config = await ensureConfig();
  res.json(config);
});

router.patch("/config", async (req, res) => {
  const parsed = UpdateConfigBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.issues });
    return;
  }

  const config = await ensureConfig();
  const updates: Record<string, unknown> = {};
  const { dismissal_time, has_lunchbox, has_star, has_dog, has_spiral } = parsed.data;
  if (dismissal_time !== undefined) updates.dismissal_time = dismissal_time;
  if (has_lunchbox !== undefined) updates.has_lunchbox = has_lunchbox;
  if (has_star !== undefined) updates.has_star = has_star;
  if (has_dog !== undefined) updates.has_dog = has_dog;
  if (has_spiral !== undefined) updates.has_spiral = has_spiral;

  const [updated] = await db
    .update(dailyConfigTable)
    .set(updates)
    .where(eq(dailyConfigTable.id, config.id))
    .returning();

  res.json(updated);
});

router.get("/summary", async (_req, res) => {
  const result = await db
    .select({
      genre: eventsTable.genre,
      done: eventsTable.done,
      count: sql<number>`count(*)::int`,
    })
    .from(eventsTable)
    .groupBy(eventsTable.genre, eventsTable.done);

  let active_tasks = 0;
  let done_tasks = 0;
  let shopping_items = 0;

  for (const row of result) {
    if (row.genre === "task" && !row.done) active_tasks = row.count;
    if (row.genre === "task" && row.done) done_tasks = row.count;
    if (row.genre === "shopping") shopping_items = row.count;
  }

  res.json({ active_tasks, done_tasks, shopping_items });
});

export default router;
