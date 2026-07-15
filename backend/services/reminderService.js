const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");

const sendMail = require("../utils/mail");

module.exports = async () => {

    console.log("========== Nhắc nhở đặt cơm ==========");

    // Menu đã publish
    const menu = await Menu.findOne({

    status: "published",

    deadline: {

        $gte: new Date()

    }

})

.sort({

    deadline: 1

});

    if (!menu) {
        console.log("Không có thực đơn đã phát hành.");
        return;
    }
    if (new Date() > menu.deadline) {
        return;
    }

    // Danh sách nhân viên
    const users = await User.find({
        role: "guest"
    });

    // Danh sách đã đặt
    const orderedIds = await Order.find({
        week: menu.week,
        status: "ordered"
    }).distinct("user");

    const needReminder = users.filter(
        (user) =>
            !orderedIds.some(
                (id) => id.toString() === user._id.toString()
            )
    );

    console.log("Tuần:", menu.week);
    console.log("Tổng nhân viên:", users.length);
    console.log("Đã đặt:", orderedIds.length);
    console.log("Cần nhắc:", needReminder.length);

    for (const user of needReminder) {

        try {

            await sendMail({
                to: user.email,
                subject: "🍱 Nhắc nhở đặt suất ăn",

                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2>Xin chào ${user.name},</h2>

                        <p>
                            Bạn vẫn chưa đặt suất ăn cho <strong>tuần tới</strong>.
                        </p>

                        <p>
                            Vui lòng đăng nhập vào hệ thống và hoàn tất việc đặt món trước thời hạn để bộ phận bếp có thể chuẩn bị đầy đủ.
                        </p>

                        <p style="margin: 24px 0;">
                            <a
                                href="https://www.eocmenu.food/"
                                style="
                                    background: #2563eb;
                                    color: white;
                                    padding: 12px 20px;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    display: inline-block;
                                "
                            >
                                Đặt món ngay
                            </a>
                        </p>

                        <p>
                            Xin cảm ơn!
                        </p>

                        <hr />

                        <p style="font-size: 12px; color: #777;">
                            Đây là email được gửi tự động từ hệ thống đặt suất ăn.
                        </p>
                    </div>
                `
            });

        } catch (err) {

            console.log("✘ Gửi thất bại:", user.email);

        }

    }

};