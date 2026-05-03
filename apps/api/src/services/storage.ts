import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

let r2Client: S3Client | null = null;

function getR2Config(): {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
} {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or R2_BUCKET_NAME"
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

function getR2Client(): S3Client {
  if (r2Client) {
    return r2Client;
  }

  const { accountId, accessKeyId, secretAccessKey } = getR2Config();
  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  return r2Client;
}

export async function uploadFile(
  key: string,
  buffer: Buffer,
  mimetype: string
): Promise<void> {
  const { bucketName } = getR2Config();
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype
    })
  );
}

export async function getPresignedUrl(
  key: string,
  expiresIn = 900
): Promise<string> {
  const { bucketName } = getR2Config();
  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }),
    { expiresIn }
  );
}

export async function deleteFile(key: string): Promise<void> {
  const { bucketName } = getR2Config();
  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    })
  );
}
