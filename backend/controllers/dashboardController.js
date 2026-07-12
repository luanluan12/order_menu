const User = require("../models/User");
const Order = require("../models/Order");

exports.getDashboard = async (req, res) => {

    try {

        // Tổng user

        const totalUsers = await User.countDocuments({

            role: "guest"

        });

        // Order đang đặt

        const orders = await Order.find({

            status: "ordered"

        }).populate(

            "user",

            "floor"

        );

        let todayOrders = 0;

        let received = 0;

        let pending = 0;

        const floorMap = {};

        const today = new Date();

        today.setHours(0, 0, 0, 0);

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

                const d = new Date(day.date);

                d.setHours(0, 0, 0, 0);

                if (d.getTime() !== today.getTime()) continue;

                const hasFood =

                    day.mains.length ||

                    day.drink ||

                    day.soup;

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

        const floors = Object.values(floorMap)

            .sort(

                (a, b) => a.floor - b.floor

            );

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