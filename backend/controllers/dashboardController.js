const User = require("../models/User");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const moment = require("moment-timezone");

exports.getDashboard = async (req, res) => {

    try {

        const today = moment()
            .tz("Asia/Ho_Chi_Minh")
            .startOf("day")
            .toDate();

        const tomorrow = moment(today)
            .add(1, "day")
            .toDate();

        const totalUsers = await User.countDocuments({
            role: "guest"
        });

        const orderedToday = await Order.countDocuments({

            date: {

                $gte: today,

                $lt: tomorrow

            },

            status: "ordered"

        });

        const notOrderedToday = Math.max(

            totalUsers - orderedToday,

            0

        );

        const currentWeek = `${moment().year()}-W${String(moment().isoWeek()).padStart(2, "0")}`;

        const currentMenu = await Menu.findOne({

            week: currentWeek

        });

        const totalMenus = await Menu.countDocuments();

        res.json({

            success: true,

            data: {

                totalUsers,

                orderedToday,

                notOrderedToday,

                totalMenus,

                currentWeek,

                menuStatus: currentMenu?.status || "draft"

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