import { randomUUID } from "crypto";
import { Job } from "bullmq";
import multer from "multer";
import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { planMiddleware } from "../middleware/planMiddleware";
import { pdfQueue, redisConnection } from "../services/queue";
import { getPresignedUrl, uploadFile } from "../services/storage";
import { supabaseAdmin } from "../services/supabase";

export const pdfRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024
  }
});

const allowedTools = new Set([
  "merge",
  "split",
  "compress",
  "convert",
  "word-to-pdf",
  "pdf-to-word",
  "powerpoint-to-pdf",
  "pdf-to-powerpoint",
  "excel-to-pdf",
  "pdf-to-excel",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "html-to-pdf",
  "rotate",
  "unlock",
  "protect",
  "watermark",
  "page-numbers",
  "repair",
  "organize",
  "crop",
  "edit",
  "sign",
  "redact",
  "ocr",
  "flatten",
  "extract-pages",
  "remove-pages",
  "compare"
]);

const processSchema = z.object({
  operation_id: z.string().uuid(),
  options: z.record(z.string(), z.unknown()).default({})
});

function isPdf(buffer: Buffer): boolean {
  return buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

pdfRouter.use(authMiddleware);

pdfRouter.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    if (!isPdf(req.file.buffer)) {
      res.status(400).json({ error: "Invalid PDF file" });
      return;
    }

    const fileKey = `${req.user!.id}/${randomUUID()}.pdf`;
    await uploadFile(fileKey, req.file.buffer, req.file.mimetype);

    const { data, error } = await supabaseAdmin
      .from("operations")
      .insert({
        user_id: req.user!.id,
        file_key: fileKey,
        original_filename: req.file.originalname,
        status: "pending"
      })
      .select("id")
      .single();

    if (error || !data) {
      res.status(500).json({ error: error?.message ?? "Failed to create operation" });
      return;
    }

    res.status(201).json({ operation_id: data.id, file_key: fileKey });
  } catch (error) {
    next(error);
  }
});

pdfRouter.post("/:tool", planMiddleware, async (req, res, next) => {
  try {
    const tool = String(req.params.tool);

    if (!allowedTools.has(tool)) {
      res.status(400).json({ error: "Unsupported PDF tool" });
      return;
    }

    const body = processSchema.parse(req.body);
    const { data: operation, error: operationError } = await supabaseAdmin
      .from("operations")
      .select("*")
      .eq("id", body.operation_id)
      .eq("user_id", req.user!.id)
      .single();

    if (operationError || !operation) {
      res.status(404).json({ error: "Operation not found" });
      return;
    }

    const job = await pdfQueue.add(tool, {
      operation_id: body.operation_id,
      tool,
      file_key: operation.file_key,
      options: body.options
    });

    const { error: updateError } = await supabaseAdmin
      .from("operations")
      .update({
        status: "processing",
        tool,
        job_id: job.id
      })
      .eq("id", body.operation_id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    await supabaseAdmin
      .from("users")
      .update({
        daily_ops_count: Number(req.userProfile?.daily_ops_count ?? 0) + 1
      })
      .eq("id", req.user!.id);

    res.json({ job_id: job.id });
  } catch (error) {
    next(error);
  }
});

pdfRouter.get("/jobs/:jobId", async (req, res, next) => {
  try {
    const job = await Job.fromId(pdfQueue, req.params.jobId);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const status = await job.getState();
    const progress = job.progress;
    const returnValue = job.returnvalue as
      | { downloadUrl?: string; result_key?: string; resultKey?: string; file_key?: string }
      | null;
    const downloadKey =
      returnValue?.result_key ?? returnValue?.resultKey ?? returnValue?.file_key;
    const downloadUrl =
      status === "completed" && downloadKey
        ? await getPresignedUrl(downloadKey)
        : returnValue?.downloadUrl;

    res.json({
      status,
      progress,
      downloadUrl: downloadUrl ?? null
    });
  } catch (error) {
    next(error);
  }
});

process.once("SIGTERM", async () => {
  await pdfQueue.close();
  await redisConnection.quit();
});
