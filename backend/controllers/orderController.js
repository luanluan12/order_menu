const Order = require("../models/Order");
const Menu = require("../models/Menu");
const User = require("../models/User");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
const XLSX = require("xlsx");
const fs = require("fs");
const sendMail = require("../utils/mail");
const orderSuccessTemplate = require("../utils/orderSuccessTemplate");

const {

    verifyOrderToken

} = require("../utils/orderToken");

// ===========================================
// Có được phép đặt món?
// ===========================================

const canOrder = () => {

    const now = moment().tz("Asia/Ho_Chi_Minh");

    const day = now.isoWeekday(); // 1 = Thứ 2 ... 7 = Chủ nhật

    const hour = now.hour();

    // Trước Thứ 4
    if (day < 3) {
        return false;
    }

    // Thứ 4 trước 09:00
    if (day === 3 && hour < 9) {
        return false;
    }

    // Sau 17:00 Thứ 6
    if (day === 5 && hour >= 17) {
        return false;
    }

    // Thứ 7 & Chủ nhật
    if (day > 5) {
        return false;
    }

    return true;

};

// ===========================================
// Build Order Days
// Dùng chung cho Create / Update / Invite
// ===========================================

const buildOrderDays = (menu, days) => {

    const result = [];

    if (!Array.isArray(days) || days.length !== 5) {

        throw new Error("Phải có đủ 5 ngày.");

    }

    for (let i = 0; i < 5; i++) {

        const menuDay = menu.days[i];

        const userDay = days[i];

        const mains = userDay.mains || [];

        const drink = userDay.drink || null;

        const soup = userDay.soup || null;

        const hasMain = mains.length > 0;

const hasDrink = !!drink;

const hasSoup = !!soup;

const totalGroup =

    Number(hasMain) +

    Number(hasDrink) +

    Number(hasSoup);

// Không chọn gì => nghỉ ăn
if (totalGroup === 0) {

    result.push({

        date: menuDay.date,

        mains: [],

        drink: null,

        soup: null,

        received: false,

        receivedAt: null

    });

    continue;

}

// Chỉ được chọn tối đa 1 nhóm
if (totalGroup > 1) {

    throw new Error(

        `Ngày ${i + 1}: Chỉ được chọn 1 nhóm.`

    );

}

        // ===================================
        // MAIN
        // ===================================

        const savedMains = [];

        if (hasMain) {

            const totalQuantity = mains.reduce(

                (sum, item) =>

                    sum + Number(item.quantity),

                0

            );

            if (totalQuantity > 2) {

                throw new Error(

                    `Ngày ${i + 1}: Tối đa 2 phần.`

                );

            }

            for (const item of mains) {

                const dish = menuDay.mains.id(

                    item.dishId

                );

                if (!dish) {

                    throw new Error(

                        `Ngày ${i + 1}: Món cơm không tồn tại.`

                    );

                }

                savedMains.push({

                    dishId: dish._id,

                    name: dish.name,

                    image: dish.image,

                    quantity: item.quantity

                });

            }

        }

        // ===================================
        // DRINK
        // ===================================

        let savedDrink = null;

        if (hasDrink) {

            const dish = menuDay.drinks.id(

                drink.dishId

            );

            if (!dish) {

                throw new Error(

                    `Ngày ${i + 1}: Món nước không tồn tại.`

                );

            }

            savedDrink = {

                dishId: dish._id,

                name: dish.name,

                image: dish.image

            };

        }

        // ===================================
        // SOUP
        // ===================================

        let savedSoup = null;

        if (hasSoup) {

            const dish = menuDay.soups.id(

                soup.dishId

            );

            if (!dish) {

                throw new Error(

                    `Ngày ${i + 1}: Món súp không tồn tại.`

                );

            }

            savedSoup = {

                dishId: dish._id,

                name: dish.name,

                image: dish.image

            };

        }

        result.push({

            date: menuDay.date,

            mains: savedMains,

            drink: savedDrink,

            soup: savedSoup

        });

    }

    return result;

};

// ===========================================
// Verify Invite
// ===========================================

exports.verifyInvite = async (

    req,

    res

) => {

    try {

        const {

            token

        } = req.body;

        const payload = verifyOrderToken(token);

        const user = await User.findById(

            payload.userId

        ).select(

            "name email employeeId"

        );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        const menu = await Menu.findById(

            payload.menuId

        );

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

        return res.json({

            success: true,

            data: {

                user,

                menu

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(401).json({

            success: false,

            message: "Link không hợp lệ hoặc đã hết hạn."

        });

    }

};

// ===========================================
// Create Order (Đăng nhập)
// ===========================================

exports.createOrder = async (req, res) => {

    try {

        if (!canOrder()) {

            return res.status(400).json({

                success: false,

                message: "Hiện không nằm trong thời gian đặt món."

            });

        }

        const {

            menuId,

            days

        } = req.body;

        const userId = req.user.id;

        const menu = await Menu.findById(menuId);

        if (

    new Date() >

    new Date(menu.deadline)

) {

    return res.status(400).json({

        success:false,

        message:"Đã hết thời gian đặt món."

    });

}

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

        const existed = await Order.findOne({

            user: userId,

            week: menu.week

        });

        if (existed) {

            return res.status(400).json({

                success: false,

                message: "Bạn đã đặt món tuần này."

            });

        }

        const orderDays = buildOrderDays(

            menu,

            days

        );

        const order = await Order.create({

            user: userId,

            menu: menu._id,

            week: menu.week,

            days: orderDays,

            status: "ordered",

        });
        const user = await User.findById(userId);

const language = (user.language || "vi").toLowerCase();

await sendMail({
    to: user.email,
    subject:
        language === "ko"
            ? `🍱 ${menu.week} 식사 주문 완료`
            : `🍱 Xác nhận đặt món ${menu.week}`,
    html: orderSuccessTemplate(user, order, language)
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

// ===========================================
// Create Order From Invite
// ===========================================

exports.createOrderFromInvite = async (

    req,

    res

) => {

    try {

        if (!canOrder()) {

            return res.status(400).json({

                success: false,

                message: "Hiện không nằm trong thời gian đặt món."

            });

        }

        const {

            token,

            days

        } = req.body;

        const payload = verifyOrderToken(

            token

        );

        const user = await User.findById(

            payload.userId

        );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy User."

            });

        }

        const menu = await Menu.findById(

            payload.menuId

        );

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

        const existed = await Order.findOne({

            user: user._id,

            week: menu.week

        });

        if (existed) {

            return res.status(400).json({

                success: false,

                message: "Bạn đã đặt món tuần này."

            });

        }

        const orderDays = buildOrderDays(

            menu,

            days

        );

        const order = await Order.create({

            user: user._id,

            menu: menu._id,

            week: menu.week,

            days: orderDays,

            status: "ordered",


        });

const language = (user.language || "vi").toLowerCase();

await sendMail({
    to: user.email,
    subject:
        language === "ko"
            ? `🍱 ${menu.week} 식사 주문 완료`
            : `🍱 Xác nhận đặt món ${menu.week}`,
    html: orderSuccessTemplate(user, order, language)
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

// ===========================================
// Update Order
// ===========================================

exports.updateOrder = async (req, res) => {

    try {

        // if (!canOrder()) {

        //     return res.status(400).json({

        //         success: false,

        //         message: "Hiện không nằm trong thời gian chỉnh sửa."

        //     });

        // }

        const { id } = req.params;

        const { days } = req.body;

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy đơn đặt món."

            });

        }

        if (

            String(order.user) !==

            String(req.user.id)

        ) {

            return res.status(403).json({

                success: false,

                message: "Không có quyền."

            });

        }

        const menu = await Menu.findById(

            order.menu

        );

//         if (

//     new Date() >

//     new Date(menu.deadline)

// ) {

//     return res.status(400).json({

//         success:false,

//         message:"Đã hết thời gian chỉnh sửa."

//     });

// }

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Menu."

            });

        }

        const orderDays = buildOrderDays(

            menu,

            days

        );

        order.days = orderDays;

        await order.save();

        return res.json({

            success: true,

            message: "Cập nhật thành công.",

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

// ===========================================
// Cancel Order
// ===========================================

exports.cancelOrder = async (req, res) => {

    try {

        if (!canOrder()) {

            return res.status(400).json({

                success: false,

                message: "Hiện không nằm trong thời gian hủy."

            });

        }

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy đơn."

            });

        }

        // Chỉ chủ đơn được hủy

        if (

            String(order.user) !==

            String(req.user.id)

        ) {

            return res.status(403).json({

                success: false,

                message: "Không có quyền."

            });

        }

        order.status = "cancelled";

        await order.save();

        return res.json({

            success: true,

            message: "Đã hủy đơn."

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

// ===========================================
// Lịch sử đặt món của User
// ===========================================

exports.getHistory = async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.user.id

        })

        .populate(

            "menu",

            "week year status"

        )

        .sort({

            createdAt: -1

        });

        return res.json({

            success: true,

            data: orders

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

// ===========================================
// Chi tiết Order
// ===========================================

exports.getOrderById = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id)

        .populate(

            "user",

            "employeeId name email"

        )

        .populate(

            "menu",

            "week year status days deadline openTime"

        );

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Order."

            });

        }

        // User chỉ xem được đơn của mình

        if (
    req.user.role === "guest" &&
    String(order.user._id) !== String(req.user.id)
) {
    return res.status(403).json({
        success: false,
        message: "Không có quyền."
    });
}

        return res.json({

            success: true,

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

exports.getAllOrders = async (req, res) => {

    try {

        const { week, status, date } = req.query;

        const filter = {};

        const userFilter = {};

if (req.user.role === "admin_floor") {
    userFilter.floor = req.user.floor;
}

        if (week) {

            filter.week = week;

        }

        if (status) {

            filter.status = status;

        }

        const users = await User.find(userFilter).select("_id");

const userIds = users.map(u => u._id);

if (req.user.role === "admin_floor") {
    filter.user = { $in: userIds };
}

const orders = await Order.find(filter)

    .populate(

        "user",

        "employeeId name email floor"

    )

    .populate(

        "menu",

        "week year"

    )

    .sort({

        createdAt: -1

    });

const result = orders
    .map(order => {

        const obj = order.toObject();

        let selectedDay = null;

        if (date) {

            selectedDay = obj.days.find(day =>

                moment(day.date)
                    .tz("Asia/Ho_Chi_Minh")
                    .format("YYYY-MM-DD") === date

            );

        }

        // Nếu chọn ngày nhưng không có ngày tương ứng
        if (date && !selectedDay) {
            return null;
        }

        // Không đăng ký suất ăn hôm đó -> bỏ khỏi danh sách
        if (
            date &&
            selectedDay &&
            selectedDay.mains.length === 0 &&
            !selectedDay.drink &&
            !selectedDay.soup
        ) {
            return null;
        }

        return {
            ...obj,
            selectedDay
        };

    })
    .filter(Boolean);

        return res.json({

            success: true,

            data: result

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
