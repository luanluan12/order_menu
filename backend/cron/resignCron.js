const cron = require("node-cron");
const moment = require("moment-timezone");
const User = require("../models/User");

async function syncResignedUsers() {
  const today = moment().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();

  const result = await User.updateMany(
    {
      status: "active",
      inactiveFrom: { $lte: today },
    },
    {
      $set: { status: "inactive" },
    },
  );

  console.log(`Resign sync updated ${result.modifiedCount} user(s).`);
}

module.exports = function startResignCron() {
  syncResignedUsers().catch((err) => {
    console.error("Initial resign sync error:", err);
  });

  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        console.log("Running resign cron...");
        await syncResignedUsers();
      } catch (err) {
        console.error("Resign cron error:", err);
      }
    },
    { timezone: "Asia/Ho_Chi_Minh" },
  );
};
