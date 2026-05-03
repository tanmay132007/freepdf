import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { ZodError } from "zod";
import { authRouter } from "./routes/auth";
import { pdfRouter } from "./routes/pdf";
import { userRouter } from "./routes/user";

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("Missing FRONTEND_URL");
}

app.use(helmet());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/user", userRouter);

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.issues });
      return;
    }

    if (error instanceof Error && error.name === "MulterError") {
      res.status(400).json({ error: error.message });
      return;
    }

    const message = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ error: message });
  }
);

const port = Number(process.env.PORT ?? 4000);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`FreePDF Editor API listening on port ${port}`);
  });
}

export default app;
