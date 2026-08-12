const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const sendMail = require("../utils/mail");
const orderMailTemplate = require("../utils/orderMailTemplate");

const frontendUrl = (process.env.FRONTEND_URL || "https://eocmenu.food").replace(/\/$/, "");

async function sendMenuAgain(menu) {
  const users = await User.find({ role: "guest", status: "active" });
  const orderedIds = await Order.find({ week: menu.week, status: "ordered" }).distinct("user");
  const orderedUserIds = new Set(orderedIds.map((id) => id.toString()));
  const recipients = users.filter((user) => !orderedUserIds.has(user._id.toString()));

  let sent = 0;
  let failed = 0;

  for (const user of recipients) {
    try {
      const language = (user.language || "vi").toLowerCase();
      await sendMail({
        to: user.email,
        subject: language === "ko" ? `${menu.week} 주간 식단` : `Thực đơn tuần ${menu.week}`,
        html: orderMailTemplate(user, menu, frontendUrl, language),
      });
      sent += 1;
    } catch (err) {
      failed += 1;
      console.error(`Resend menu failed for ${user.email}:`, err.message);
    }
  }

  menu.resendStatus = failed === recipients.length && recipients.length > 0 ? "failed" : "completed";
  menu.resendResult = { total: recipients.length, sent, failed, completedAt: new Date() };
  await menu.save();
  console.log(`Menu ${menu.week} resend completed: ${sent}/${recipients.length} sent.`);
}

async function processScheduledMenuResends() {
  while (true) {
    const menu = await Menu.findOneAndUpdate(
      { resendStatus: "scheduled", resendAt: { $lte: new Date() } },
      { $set: { resendStatus: "processing" } },
      { new: true },
    );

    if (!menu) return;

    try {
      await sendMenuAgain(menu);
    } catch (err) {
      console.error("Scheduled menu resend error:", err);
      menu.resendStatus = "failed";
      menu.resendResult = { total: 0, sent: 0, failed: 0, completedAt: new Date() };
      await menu.save();
    }
  }
}

module.exports = { processScheduledMenuResends };
