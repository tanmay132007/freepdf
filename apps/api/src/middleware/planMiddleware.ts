import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase";

function startOfTodayIso(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

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

export async function planMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { data: profile, error } = await supabaseAdmin
    .from("users")
    .select("*, plans(*)")
    .eq("id", req.user.id)
    .single();

  if (error || !profile) {
    res.status(403).json({ error: "User profile not found" });
    return;
  }

  const todayIso = startOfTodayIso();
  const resetAt = profile.daily_ops_reset_at
    ? new Date(profile.daily_ops_reset_at)
    : null;
  const shouldReset = !resetAt || resetAt < new Date(todayIso);
  let dailyOpsCount = Number(profile.daily_ops_count ?? 0);
  let currentProfile = profile;

  if (shouldReset) {
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ daily_ops_count: 0, daily_ops_reset_at: todayIso })
      .eq("id", req.user.id)
      .select("*, plans(*)")
      .single();

    if (updateError || !updatedProfile) {
      res.status(500).json({ error: "Failed to reset usage" });
      return;
    }

    dailyOpsCount = 0;
    currentProfile = updatedProfile;
  }

  const plan = normalizePlan(currentProfile.plans);
  const dailyLimit = getDailyLimit(plan);

  if (dailyOpsCount >= dailyLimit) {
    res.status(429).json({ error: "Daily limit reached", upgrade: true });
    return;
  }

  req.userProfile = currentProfile;
  req.plan = plan ?? undefined;
  next();
}
