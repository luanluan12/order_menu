require("dotenv").config();

const sendMail = require("./utils/mail");

(async () => {
  try {
    await sendMail({
      to: "thoiluan52@gmail.com",
      subject: "Kiểm tra gửi email - Food Order System",
      html: "<h1>Gửi email thành công</h1><p>Đây là email kiểm tra Resend từ Food Order System.</p>",
    });

    console.log("Send mail success");
  } catch (err) {
    console.error("Send mail failed:", err.message);
  }
})();
