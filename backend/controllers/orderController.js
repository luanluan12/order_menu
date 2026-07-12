const Order = require("../models/Order");
const Menu = require("../models/Menu");
const User = require("../models/User");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
const crypto = require("crypto");
const XLSX = require("xlsx");
const fs = require("fs");

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

            qrToken: crypto.randomUUID()

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

            qrToken: crypto.randomUUID()

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

        if (!canOrder()) {

            return res.status(400).json({

                success: false,

                message: "Hiện không nằm trong thời gian chỉnh sửa."

            });

        }

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

        if (

    new Date() >

    new Date(menu.deadline)

) {

    return res.status(400).json({

        success:false,

        message:"Đã hết thời gian chỉnh sửa."

    });

}

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

            req.user.role !== "admin" &&

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

        if (week) {

            filter.week = week;

        }

        if (status) {

            filter.status = status;

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

// ===============================
// GET MY QR
// ===============================

exports.getMyQr = async (req, res) => {

    try {

        const userId = req.user.id;

        const order = await Order.findOne({

            user: userId,

            status: "ordered"

        }).sort({

            createdAt: -1

        });

        if (!order) {

            return res.status(404).json({

                message: "Bạn chưa đặt món."

            });

        }

        const qrImage = await QRCode.toDataURL(

            JSON.stringify({

                token: order.qrToken

            })

        );

        res.json({

            success: true,

            data: {

                week: order.week,

                qrToken: order.qrToken,

                qrImage

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không tạo được QR."

        });

    }

};

// ===============================
// PREVIEW QR
// ===============================

exports.previewQr = async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {

            return res.status(400).json({

                success: false,

                message: "Thiếu QR."

            });

        }

        const order = await Order.findOne({

            qrToken: token,

            status: "ordered"

        }).populate(

            "user",

            "employeeId name email floor"

        );

        if (!order) {

    return res.status(404).json({

        success: false,

        message: "Không tìm thấy Order."

    });

}
        const todayStr = moment()
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DD");

const day = order.days.find(d => {

    return (
        moment(d.date)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD") === todayStr
    );

});

        if (!day) {

    return res.status(400).json({

        success: false,

        message: "Không tìm thấy ngày."

    });

}
const hasMeal =
    day.mains.length > 0 ||
    !!day.drink ||
    !!day.soup;

        return res.json({

    success: true,

    data: {

        orderId: order._id,

        employee: {

            employeeId: order.user.employeeId,

            name: order.user.name,

            email: order.user.email,

            floor: order.user.floor

        },

        date: day.date,

        received: day.received,

        receivedAt: day.receivedAt,

        hasMeal,

        mains: day.mains,

        drink: day.drink,

        soup: day.soup

    }

});

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Lỗi server."

        });

    }

};

// ===============================
// CONFIRM RECEIVE
// ===============================

exports.confirmReceive = async (req, res) => {

    try {

        const { orderId } = req.body;

        if (!orderId) {

            return res.status(400).json({

                success: false,

                message: "Thiếu Order ID."

            });

        }

        const order = await Order.findById(orderId)

            .populate(

                "user",

                "employeeId name email floor"

            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Order."

            });

        }


const todayStr = moment()
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DD");

const day = order.days.find(d =>

    moment(d.date)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD") === todayStr

);

        if (!day) {

            return res.status(400).json({

                success: false,

                message: "Đơn không có suất ăn hôm nay."

            });

        }

        const hasMeal =
    day.mains.length > 0 ||
    !!day.drink ||
    !!day.soup;

if (!hasMeal) {

    return res.status(400).json({

        success: false,

        message: "Hôm nay nhân viên không đăng ký suất ăn."

    });

}

        if (day.received) {

            return res.status(409).json({

                success: false,

                code: "ALREADY_RECEIVED",

                message: "Nhân viên đã nhận suất ăn.",

                receivedAt: day.receivedAt

            });

        }

        day.received = true;

        day.receivedAt = new Date();

        await order.save();

        return res.json({

            success: true,

            message: "Xác nhận nhận món thành công.",

            data: {

                employee: order.user,

                date: day.date,

                received: true,

                receivedAt: day.receivedAt

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Lỗi server."

        });

    }

};