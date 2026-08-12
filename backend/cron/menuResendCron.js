const cron = require("node-cron");
const { processScheduledMenuResends } = require("../services/menuResendService");

module.exports = function startMenuResendCron() {
  cron.schedule(
    "* * * * *",
    () => processScheduledMenuResends().catch((err) => console.error("Menu resend cron error:", err)),
    { timezone: "Asia/Ho_Chi_Minh" },
  );
};
