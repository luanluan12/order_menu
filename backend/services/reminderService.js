const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");

const sendMail = require("../utils/mail");

module.exports = async () => {

    console.log("========== Nhắc nhở đặt cơm ==========");
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

        let subject = "";
        let html = "";

        if (user.language === "ko") {

            subject = "🍱 식사 주문 알림";

            html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>${user.name}님, 안녕하세요.</h2>

                    <p>
                        다음 주 식사 주문이 아직 완료되지 않았습니다.
                    </p>

                    <p>
                        마감 시간 전에 시스템에 접속하여 식사 주문을 완료해 주세요.
                    </p>

                    <p style="margin:24px 0;">
                        <a
                            href="https://www.eocmenu.food/"
                            style="
                                background:#2563eb;
                                color:white;
                                padding:12px 20px;
                                text-decoration:none;
                                border-radius:6px;
                                display:inline-block;
                            "
                        >
                            식사 주문하기
                        </a>
                    </p>

                    <p>감사합니다.</p>

                    <hr>

                    <p style="font-size:12px;color:#777;">
                        본 메일은 식사 주문 시스템에서 자동으로 발송되었습니다.
                    </p>
                </div>
            `;

        } else {

            subject = "🍱 Nhắc nhở đặt suất ăn";

            html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Xin chào ${user.name},</h2>

                    <p>
                        Bạn vẫn chưa đặt suất ăn cho <strong>tuần tới</strong>.
                    </p>

                    <p>
                        Vui lòng đăng nhập vào hệ thống và hoàn tất việc đặt món trước thời hạn để bộ phận bếp có thể chuẩn bị đầy đủ.
                    </p>

                    <p style="margin:24px 0;">
                        <a
                            href="https://www.eocmenu.food/"
                            style="
                                background:#2563eb;
                                color:white;
                                padding:12px 20px;
                                text-decoration:none;
                                border-radius:6px;
                                display:inline-block;
                            "
                        >
                            Đặt món ngay
                        </a>
                    </p>

                    <p>Xin cảm ơn!</p>

                    <hr>

                    <p style="font-size:12px;color:#777;">
                        Đây là email được gửi tự động từ hệ thống đặt suất ăn.
                    </p>
                </div>
            `;

        }

        await sendMail({
            to: user.email,
            subject,
            html,
        });

        console.log("✔ Đã gửi:", user.email);

    } catch (err) {

        console.log("✘ Gửi thất bại:", user.email);

    }

}

};