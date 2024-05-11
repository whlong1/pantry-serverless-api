import { S3Client } from "@aws-sdk/client-s3";

// Initialize S3Client instance:
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export default s3Client