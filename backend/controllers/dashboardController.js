const User = require("../models/User");
const Order = require("../models/Order");
const moment = require("moment-timezone");

exports.getDashboard = async (req, res) => {

    try {

        // Tổng user
        let userFilter = {
    role: "guest"
};

if (req.user.role === "admin_floor") {
    userFilter.floor = req.user.floor;
}

        const totalUsers = await User.countDocuments(userFilter);

        // Order đang đặt

        let orderFilter = {
    status: "ordered"
};

if (req.user.role === "admin_floor") {

    const users = await User.find({
        role: "guest",
        floor: req.user.floor
    }).select("_id");

    orderFilter.user = {
        $in: users.map(u => u._id)
    };
}

const orders = await Order.find(orderFilter).populate(
    "user",
    "floor"
);

        let todayOrders = 0;

        let received = 0;

        let pending = 0;

        const floorMap = {};

        const today = moment()
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DD");

        for (const order of orders) {

            const floor = order.user?.floor || 0;

            if (!floorMap[floor]) {

                floorMap[floor] = {

                    floor,

                    ordered: 0,

                    received: 0,

                    pending: 0

                };

            }

            for (const day of order.days) {

                const d = moment(day.date)
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DD");

if (d !== today) continue;

                const hasFood =
    day.mains.some(item => item.quantity > 0) ||
    !!day.drink ||
    !!day.soup;

                if (!hasFood) continue;

                todayOrders++;

                floorMap[floor].ordered++;

                if (day.received) {

                    received++;

                    floorMap[floor].received++;

                }

                else {

                    pending++;

                    floorMap[floor].pending++;

                }

            }

        }

        let floors = Object.values(floorMap)
    .sort((a, b) => a.floor - b.floor);

if (req.user.role === "admin_floor") {
    floors = floors.filter(
        f => f.floor === req.user.floor
    );
}

        res.json({

            success: true,

            data: {

                totalUsers,

                todayOrders,

                received,

                pending,

                floors

            }

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};