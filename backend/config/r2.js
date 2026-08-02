const {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET_NAME;

const r2 = new S3Client({
  region: "auto",
  endpoint:
    process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const getPublicUrl = (key) => {
  const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL is required to serve uploaded images.");
  }

  return `${publicUrl}/${key}`;
};

module.exports = {
  bucket,
  getPublicUrl,
  r2,
  DeleteObjectCommand,
  PutObjectCommand,
};
