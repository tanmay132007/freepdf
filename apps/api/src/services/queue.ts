import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const rawRedisUrl = process.env.REDIS_URL;

if (!rawRedisUrl) {
  throw new Error("Missing REDIS_URL");
}

function normalizeRedisUrl(value: string): string {
  const match = value.match(/redis(?:s)?:\/\/\S+/);
  return match ? match[0] : value;
}

const redisUrl = normalizeRedisUrl(rawRedisUrl);
const usesTls = rawRedisUrl.includes("--tls") || redisUrl.startsWith("rediss://");

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: usesTls ? {} : undefined
});

export const pdfQueue = new Queue("pdf-processing", {
  connection: redisConnection
});
