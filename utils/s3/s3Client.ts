import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_SECRET_AWS_REGION || "auto",
  endpoint: process.env.NEXT_PUBLIC_SECRET_AWS_ENDPOINT_URL_S3 || "https://fly.storage.tigris.dev",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SECRET_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_AWS_SECRET_ACCESS_KEY || "",
  },
});

export default s3Client;
