const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const Menu = require("../models/Menu");
const { uploadMenuImage } = require("../services/r2Storage");

const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com/");

async function copyImage(url, fallbackName) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Không tải được ảnh (${response.status}): ${url}`);
  }

  return uploadMenuImage({
    buffer: Buffer.from(await response.arrayBuffer()),
    mimetype:
      response.headers.get("content-type")?.split(";")[0] || "image/jpeg",
    originalname: fallbackName,
  });
}

async function migrate() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const menus = await Menu.find({
    $or: [
      { "days.mains.image": /res\.cloudinary\.com\// },
      { "days.drinks.image": /res\.cloudinary\.com\// },
      { "days.soups.image": /res\.cloudinary\.com\// },
      { "days.desserts.image": /res\.cloudinary\.com\// },
    ],
  });

  let migrated = 0;

  for (const menu of menus) {
    let changed = false;

    for (const day of menu.days) {
      for (const group of ["mains", "drinks", "soups", "desserts"]) {
        for (const dish of day[group] || []) {
          if (!isCloudinaryUrl(dish.image)) continue;

          const uploaded = await copyImage(
            dish.image,
            `${group}-${dish._id || Date.now()}.jpg`,
          );

          dish.image = uploaded.image;
          dish.imagePublicId = uploaded.imagePublicId;

          changed = true;
          migrated += 1;

          console.log(`Migrated ${migrated}: ${uploaded.imagePublicId}`);
        }
      }
    }

    if (changed) {
      await menu.save();
    }
  }

  console.log(`Completed. Migrated ${migrated} image(s) to Cloudflare R2.`);
}

migrate()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
