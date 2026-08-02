const crypto = require("crypto");
const path = require("path");

const {
  bucket,
  DeleteObjectCommand,
  getPublicUrl,
  PutObjectCommand,
  r2,
} = require("../config/r2");

const extensionByMimeType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function ensureConfigured() {
  if (
    !bucket ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_PUBLIC_URL
  ) {
    throw new Error("Cloudflare R2 chưa được cấu hình đầy đủ.");
  }
}

function getExtension(file) {
  const fromMimeType = extensionByMimeType[file.mimetype];
  const fromName = path
    .extname(file.originalname || "")
    .slice(1)
    .toLowerCase();

  return fromMimeType || fromName || "jpg";
}

async function uploadMenuImage(file) {
  ensureConfigured();

  const key = `food-menu/${Date.now()}-${crypto.randomUUID()}.${getExtension(file)}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    image: getPublicUrl(key),
    imagePublicId: key,
  };
}

async function deleteMenuImage(key) {
  // Không xoá nhầm ảnh Cloudinary cũ.
  if (!key || !key.startsWith("food-menu/")) return;

  ensureConfigured();

  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

module.exports = {
  deleteMenuImage,
  uploadMenuImage,
};
