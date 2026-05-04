import { cpSync, existsSync, rmSync } from "node:fs";

const source = "web/.next";
const target = ".next";

if (!existsSync(source)) {
  throw new Error(`Expected Next.js build output at ${source}`);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
