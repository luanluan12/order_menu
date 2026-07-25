const cron = require("node-cron");
const moment = require("moment-timezone");

const User = require("../models/User");

module.exports = function startResignCron() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        console.log("Running resign cron...");

        const today = moment().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();

        const result = await User.updateMany(
          {
            status: "active",
            inactiveFrom: {
              $lte: today,
            },
          },
          {
            $set: {
              status: "inactive",
            },
          },
        );

        console.log(`Resign cron updated ${result.modifiedCount} user(s).`);
      } catch (err) {
        console.error("Resign cron error:", err);
      }
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};
