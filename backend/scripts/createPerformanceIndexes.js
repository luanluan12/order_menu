require("dotenv").config({ path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev" });
const mongoose = require("mongoose");
const Menu = require("../models/Menu");
const Order = require("../models/Order");

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
  try {
    // Additive only: never drop or rebuild unrelated production indexes.
    await Menu.collection.createIndex({ "days.date": 1 });
    await Order.collection.createIndex({ week: 1, status: 1 });
    await Order.collection.createIndex({ "days.date": 1, status: 1 });
    await Order.collection.createIndex({ "confirmationEmail.nextAttemptAt": 1 }, {
      partialFilterExpression: { "confirmationEmail.nextAttemptAt": { $exists: true } },
    });
    console.log("Performance indexes ready");
  } finally {
    await mongoose.disconnect();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
