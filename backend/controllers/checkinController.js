const crypto = require("crypto");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
const Order = require("../models/Order");

const CheckinToken = require("../models/CheckinToken");

exports.getTodayQr = async (req, res) => {

    try {

        let checkin = await CheckinToken.findOne({
            floor: req.user.floor
        });

        if (!checkin) {

            checkin = await CheckinToken.create({

                floor: req.user.floor,

                token: crypto.randomUUID(),

                active: true

            });
        } else {

        }

        const qrImage = await QRCode.toDataURL(
            JSON.stringify({
                token: checkin.token
            })
        );

        return res.json({

            success: true,

            data: {

                floor: req.user.floor,

                token: checkin.token,

                qrImage

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.checkIn = async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {

            return res.status(400).json({

                success: false,
                message: "Thiếu token."

            });

        }

        const today = moment()
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD");

        // ======================
        // Kiểm tra QR
        // ======================

        const checkin = await CheckinToken.findOne({

            token,

            active: true

        });

        if (!checkin) {

            return res.status(400).json({

                success: false,
                message: "QR không hợp lệ"

            });

        }

        // ======================
        // Tìm Order
        // ======================

        const order = await Order.findOne({

            user: req.user.id,

            status: "ordered"

        }).populate(
            "user",
            "name email floor employeeId"
        );

        if (checkin.floor !== order.user.floor) {

    return res.status(403).json({

        success: false,

        message: "QR không thuộc tầng của bạn."

    });

}

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Không tìm thấy đơn."

            });

        }

        // ======================
        // Tìm ngày hôm nay
        // ======================

        const day = order.days.find(d => {

            return moment(d.date)

                .tz("Asia/Ho_Chi_Minh")

                .format("YYYY-MM-DD") === today;

        });

        if (!day) {

            return res.status(400).json({

                success: false,
                message: "Hôm nay không có suất ăn."

            });

        }

        const hasMeal =

            day.mains.length > 0 ||

            day.drink ||

            day.soup;

        if (!hasMeal) {

            return res.status(400).json({

                success: false,
                message: "Bạn không đăng ký suất ăn hôm nay."

            });

        }

        if (day.received) {

            return res.status(409).json({

                success: false,
                message: "Bạn đã nhận suất ăn."

            });

        }

        day.received = true;

        day.receivedAt = new Date();

        await order.save();
        const io = req.app.get("io");

io.emit("checkin-success", {

    employee: {

        name: order.user.name,

        email: order.user.email,

        floor: order.user.floor,

        employeeId: order.user.employeeId

    },

    receivedAt: day.receivedAt,

    mains: day.mains,

    drink: day.drink,

    soup: day.soup

});

        return res.json({

            success: true,

            message: "Check-in thành công.",

            data: {

                receivedAt: day.receivedAt

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
