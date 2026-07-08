const Order = require("../models/Order");
const Menu = require("../models/Menu");
const moment = require("moment-timezone");
const { verifyOrderToken } = require("../utils/orderToken");
const User = require("../models/User");

const canOrder = () => {

    const now = moment().tz("Asia/Ho_Chi_Minh");

    const day = now.isoWeekday(); // 1=Mon ... 7=Sun
    const hour = now.hour();

    // Thứ 2,3
    if (day < 3) return false;

    // Thứ 4 trước 9h
    if (day === 3 && hour < 9) return false;

    // Sau 17h thứ 6
    if (day === 5 && hour >= 17) return false;

    // Thứ 7, CN
    if (day > 5) return false;

    return true;
};

/**
 * Verify Invite Link
 */
exports.verifyInvite = async (req, res) => {

    try {

        const { token } = req.body;

        const payload = verifyOrderToken(token);

        const user = await User.findById(payload.userId)

            .select("name email employeeId");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        const menu = await Menu.findById(payload.menuId);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Menu not found."

            });

        }

        if (menu.status !== "published") {

            return res.status(400).json({

                success: false,

                message: "Menu chưa Publish."

            });

        }

        res.json({

            success: true,

            data: {

                user,

                menu

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(401).json({

            success: false,

            message: "Link không hợp lệ hoặc đã hết hạn."

        });

    }

};

/**
 * Đặt món
 */

// exports.createOrder = async (req, res) => {

//     try {

//         const {

//             menuId,

//             orders

//         } = req.body;

//         if (!orders || orders.length !== 5) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Phải đặt đủ 5 ngày."

//             });

//         }

//         const menu = await Menu.findById(menuId);

//         if (!menu) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Menu not found."

//             });

//         }

//         if (menu.status !== "published") {

//             return res.status(400).json({

//                 success: false,

//                 message: "Menu chưa Publish."

//             });

//         }

//         const docs = [];

//         for (const item of orders) {

//             const existed = await Order.findOne({

//                 user: req.user.id,

//                 menu: menuId,

//                 date: item.date

//             });

//             if (existed) {

//                 continue;

//             }

//             docs.push({

//                 user: req.user.id,

//                 menu: menuId,

//                 date: item.date,

//                 option: item.option,

//                 selectedMain: item.selectedMain,

//                 status: "ordered"

//             });

//         }

//         if (docs.length === 0) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Bạn đã đặt món tuần này."

//             });

//         }

//         await Order.insertMany(docs);

//         res.status(201).json({

//             success: true,

//             message: "Đặt món thành công.",

//             total: docs.length

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };
exports.createOrder = async (req, res) => {

    try {

        const {

            menuId,

            days

        } = req.body;

        // ===========================
        // Validate Request
        // ===========================

        if (!menuId) {

            return res.status(400).json({

                success: false,

                message: "Thiếu Menu."

            });

        }

        if (!Array.isArray(days)) {

            return res.status(400).json({

                success: false,

                message: "Dữ liệu không hợp lệ."

            });

        }

        if (days.length !== 5) {

            return res.status(400).json({

                success: false,

                message: "Phải đặt đủ 5 ngày."

            });

        }

        // ===========================
        // Find Menu
        // ===========================

        const menu = await Menu.findById(menuId);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Menu."

            });

        }

        if (menu.status !== "published") {

            return res.status(400).json({

                success: false,

                message: "Menu chưa được Publish."

            });

        }

        // ===========================
        // Check Ordered
        // ===========================

        const existed = await Order.findOne({

            user: req.user.id,

            week: menu.week,

            status: "ordered"

        });

        if (existed) {

            return res.status(400).json({

                success: false,

                message: "Bạn đã đặt món tuần này."

            });

        }

        // ===========================
        // Prepare Result
        // ===========================

        const orderDays = [];

        // ===========================
        // Validate 5 Days
        // ===========================

        for (let i = 0; i < menu.days.length; i++) {

            const menuDay = menu.days[i];

            const userDay = days[i];

            if (!userDay) {

                return res.status(400).json({

                    success: false,

                    message: `Thiếu dữ liệu ngày ${i + 1}.`

                });

            }

            const mains = userDay.mains || [];

            const drink = userDay.drink || null;

            const soup = userDay.soup || null;

            // ===== Part 2 sẽ xử lý tiếp ở đây =====
            // ===========================
            // Option 1 : Main
            // ===========================

            const hasMain = mains.length > 0;
            const hasDrink = !!drink;
            const hasSoup = !!soup;

            // Chỉ được chọn 1 nhóm
            const selectedGroup =
                Number(hasMain) +
                Number(hasDrink) +
                Number(hasSoup);

            if (selectedGroup !== 1) {

                return res.status(400).json({

                    success: false,

                    message: `Ngày ${i + 1}: Chỉ được chọn 1 nhóm.`

                });

            }

            // ===========================
            // MAIN
            // ===========================

            const savedMains = [];

            if (hasMain) {

                const totalQuantity = mains.reduce(

                    (sum, item) =>

                        sum + Number(item.quantity || 0),

                    0

                );

                if (totalQuantity > 2) {

                    return res.status(400).json({

                        success: false,

                        message: `Ngày ${i + 1}: Chỉ được chọn tối đa 2 phần món chính.`

                    });

                }

                for (const item of mains) {

                    const dish = menuDay.mains.id(item.dishId);

                    if (!dish) {

                        return res.status(400).json({

                            success: false,

                            message: `Ngày ${i + 1}: Món chính không tồn tại.`

                        });

                    }

                    savedMains.push({

                        dishId: dish._id,

                        name: dish.name,

                        image: dish.image,

                        quantity: item.quantity

                    });

                }

            }

            // ===========================
            // DRINK
            // ===========================

            let savedDrink = null;

            if (hasDrink) {

                const dish = menuDay.drinks.id(drink);

                if (!dish) {

                    return res.status(400).json({

                        success: false,

                        message: `Ngày ${i + 1}: Nước không tồn tại.`

                    });

                }

                savedDrink = {

                    dishId: dish._id,

                    name: dish.name,

                    image: dish.image

                };

            }

            // ===========================
            // SOUP
            // ===========================

            let savedSoup = null;

            if (hasSoup) {

                const dish = menuDay.soups.id(soup);

                if (!dish) {

                    return res.status(400).json({

                        success: false,

                        message: `Ngày ${i + 1}: Cháo/Súp không tồn tại.`

                    });

                }

                savedSoup = {

                    dishId: dish._id,

                    name: dish.name,

                    image: dish.image

                };

            }

            orderDays.push({

                date: menuDay.date,

                mains: savedMains,

                drink: savedDrink,

                soup: savedSoup

            });

        }
        // ===========================
        // Create Order
        // ===========================

        const order = await Order.create({

            user: req.user.id,

            menu: menu._id,

            week: menu.week,

            days: orderDays,

            status: "ordered"

        });

        return res.status(201).json({

            success: true,

            message: "Đặt món thành công.",

            data: order

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


/**
 * Lịch sử đặt món
 */
/**
 * Lịch sử đặt món theo tuần
 */
exports.getHistory = async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.user.id

        })

            .populate({

                path: "menu",

                select: "week year status"

            })

            .sort({

                date: 1

            });

        const histories = [];

        const map = new Map();

        for (const order of orders) {

            const key = order.menu._id.toString();

            if (!map.has(key)) {

                map.set(key, {

                    menuId: order.menu._id,

                    week: order.menu.week,

                    year: order.menu.year,

                    status: order.menu.status,

                    days: []

                });

            }

            map.get(key).days.push({

                orderId: order._id,

                date: order.date,

                option: order.option,

                selectedMain: order.selectedMain,

                status: order.status

            });

        }

        map.forEach(value => histories.push(value));

        histories.sort((a, b) =>

            b.week.localeCompare(a.week)

        );

        res.json({

            success: true,

            data: histories

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Chi tiết đơn hàng
 */
exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)

            .populate("menu")

            .populate("user", "name email");

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        res.json({

            success: true,

            data: order

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Cập nhật đơn
 */
/**
 * Cập nhật Order cả tuần
 */
// exports.updateOrder = async (req, res) => {

//     try {

//         const {

//             menuId,

//             orders

//         } = req.body;

//         if (!orders || orders.length !== 5) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Phải có đủ 5 ngày."

//             });

//         }

//         const menu = await Menu.findById(menuId);

//         if (!menu) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Menu không tồn tại."

//             });

//         }

//         if (menu.status !== "published") {

//             return res.status(400).json({

//                 success: false,

//                 message: "Menu chưa Publish."

//             });

//         }

//         for (const item of orders) {

//             const order = await Order.findOne({

//                 user: req.user.id,

//                 menu: menuId,

//                 date: item.date

//             });

//             if (!order) {

//                 continue;

//             }

//             order.option = item.option;

//             order.selectedMain = item.selectedMain;

//             order.status = "ordered";

//             await order.save();

//         }

//         res.json({

//             success: true,

//             message: "Cập nhật thực đơn thành công."

//         });

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };
exports.updateOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const { days } = req.body;

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy đơn đặt."

            });

        }

        // Chỉ cho phép chủ đơn hoặc admin sửa
        if (

            String(order.user) !== String(req.user.id) &&

            req.user.role !== "admin_eocmn"

        ) {

            return res.status(403).json({

                success: false,

                message: "Không có quyền."

            });

        }

        const menu = await Menu.findById(order.menu);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Menu."

            });

        }

        if (menu.status !== "published") {

            return res.status(400).json({

                success: false,

                message: "Menu chưa Publish."

            });

        }

        if (!Array.isArray(days) || days.length !== 5) {

            return res.status(400).json({

                success: false,

                message: "Phải có đủ 5 ngày."

            });

        }

        // Dùng chung logic với createOrder()
        const orderDays = await buildOrderDays(

            menu,

            days

        );

        order.days = orderDays;

        await order.save();

        return res.json({

            success: true,

            message: "Cập nhật đơn thành công.",

            data: order

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
/**
 * Hủy đơn
 */
/**
 * Hủy Order cả tuần
 */
exports.cancelOrder = async (req, res) => {

    try {

        const {

            menuId

        } = req.body;

        const menu = await Menu.findById(menuId);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Menu không tồn tại."

            });

        }

        const result = await Order.updateMany(

            {

                user: req.user.id,

                menu: menuId,

                status: "ordered"

            },

            {

                $set: {

                    status: "cancelled"

                }

            }

        );

        if (result.matchedCount === 0) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy đơn để hủy."

            });

        }

        res.json({

            success: true,

            message: "Đã hủy đặt món cả tuần.",

            total: result.modifiedCount

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Admin xem toàn bộ đơn hàng
 */
exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("user", "name email floor")

            .populate("menu")

            .sort({

                createdAt: -1

            });

        res.json({

            success: true,

            data: orders

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
/**
 * Đặt món từ Email Invite
 */
exports.createOrderFromInvite = async (req, res) => {

    try {

        const {

            token,

            orders

        } = req.body;

        const payload = verifyOrderToken(token);

        const menu = await Menu.findById(payload.menuId);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Menu not found."

            });

        }

        if (menu.status !== "published") {

            return res.status(400).json({

                success: false,

                message: "Menu chưa Publish."

            });

        }

        const docs = [];

        for (const item of orders) {

            const existed = await Order.findOne({

                user: payload.userId,

                menu: menu._id,

                date: item.date

            });

            if (existed) {

                continue;

            }

            docs.push({

                user: payload.userId,

                menu: menu._id,

                date: item.date,

                option: item.option,

                selectedMain: item.selectedMain,

                status: "ordered"

            });

        }

        if (docs.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Bạn đã đặt món tuần này."

            });

        }

        await Order.insertMany(docs);

        res.json({

            success: true,

            message: "Đặt món thành công.",

            total: docs.length

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};