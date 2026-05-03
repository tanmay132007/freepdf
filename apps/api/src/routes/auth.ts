import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../services/supabase";

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1)
});

authRouter.post("/signup", async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.full_name
      }
    });

    if (error || !data.user) {
      res.status(400).json({ error: error?.message ?? "Failed to sign up" });
      return;
    }

    const { error: profileError } = await supabaseAdmin.from("users").insert({
      id: data.user.id,
      email: body.email,
      full_name: body.full_name ?? null,
      daily_ops_count: 0,
      daily_ops_reset_at: new Date().toISOString()
    });

    if (profileError) {
      res.status(400).json({ error: profileError.message });
      return;
    }

    res.status(201).json({ user: data.user });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.auth.signInWithPassword(body);

    if (error || !data.session) {
      res.status(401).json({ error: error?.message ?? "Invalid credentials" });
      return;
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    if (token) {
      const { error } = await supabaseAdmin.auth.admin.signOut(token);
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const body = refreshSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: body.refresh_token
    });

    if (error || !data.session) {
      res.status(401).json({ error: error?.message ?? "Unable to refresh" });
      return;
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    });
  } catch (error) {
    next(error);
  }
});
