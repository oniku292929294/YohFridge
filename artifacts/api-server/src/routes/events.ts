import { Router } from "express";
import { db, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateEventBody, UpdateEventBody } from "@workspace/api-zod";

const router = Router();

function detectGenre(title: string, explicitGenre?: string): "task" | "shopping" {
  if (title.includes("買う")) return "shopping";
  if (explicitGenre === "shopping" || explicitGenre === "task") return explicitGenre;
  return "task";
}

router.get("/events", async (_req, res) => {
  const events = await db
    .select()
    .from(eventsTable)
    .orderBy(eventsTable.created_at);
  res.json(events);
});

router.post("/events", async (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.issues });
    return;
  }

  const { title, detail, genre, accent_color } = parsed.data;
  const resolvedGenre = detectGenre(title, genre ?? undefined);

  const [event] = await db
    .insert(eventsTable)
    .values({ title, detail, genre: resolvedGenre, accent_color })
    .returning();

  res.status(201).json(event);
});

router.patch("/events/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.issues });
    return;
  }

  const updates: Record<string, unknown> = {};
  const { title, detail, genre, done, accent_color } = parsed.data;
  if (title !== undefined) updates.title = title;
  if (detail !== undefined) updates.detail = detail;
  if (genre !== undefined) updates.genre = genre;
  if (done !== undefined) updates.done = done;
  if (accent_color !== undefined) updates.accent_color = accent_color;

  if (title) {
    updates.genre = detectGenre(title as string, genre ?? undefined);
  }

  const [event] = await db
    .update(eventsTable)
    .set(updates)
    .where(eq(eventsTable.id, id))
    .returning();

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(event);
});

router.delete("/events/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(eventsTable)
    .where(eq(eventsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.status(204).send();
});

export default router;
