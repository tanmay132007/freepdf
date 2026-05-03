import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { supabaseAdmin } from "../services/supabase";

export const userRouter = Router();

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  avatar_url: z.string().url().nullable().optional()
});

function getDailyLimit(plan: Record<string, unknown> | null | undefined): number {
  const value =
    plan?.daily_ops_limit ??
    plan?.daily_limit ??
    plan?.max_daily_ops ??
    plan?.operations_per_day;

  return typeof value === "number" ? value : 10;
}

function normalizePlan(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    return (value[0] as Record<string, unknown> | undefined) ?? null;
  }

  return (value as Record<string, unknown> | null) ?? null;
}

userRouter.use(authMiddleware);

userRouter.get("/profile", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*, plans(*)")
      .eq("id", req.user!.id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ user: data });
  } catch (error) {
    next(error);
  }
});

userRouter.patch("/profile", async (req, res, next) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(body)
      .eq("id", req.user!.id)
      .select("*, plans(*)")
      .single();

    if (error || !data) {
      res.status(400).json({ error: error?.message ?? "Unable to update profile" });
      return;
    }

    res.json({ user: data });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/usage", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("daily_ops_count, daily_ops_reset_at, plans(*)")
      .eq("id", req.user!.id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Usage not found" });
      return;
    }

    const plan = normalizePlan(data.plans);

    res.json({
      daily_ops_count: data.daily_ops_count ?? 0,
      daily_ops_reset_at: data.daily_ops_reset_at,
      daily_limit: getDailyLimit(plan),
      plan
    });
  } catch (error) {
    next(error);
  }
});
