const Order = require("../models/Order");
const Menu = require("../models/Menu");
const User = require("../models/User");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
const XLSX = require("xlsx");
const fs = require("fs");
const sendMail = require("../utils/mail");
const orderSuccessTemplate = require("../utils/orderSuccessTemplate");
const { verifyOrderToken } = require("../utils/orderToken");

// ===========================================
// Có được phép đặt món?
// ===========================================

const canOrder = (menu) => {
  const now = moment().tz("Asia/Ho_Chi_Minh");
  // `published` là dấu hiệu menu đã được admin gửi. Không dùng openTime để
  // chặn vì các menu đã publish trước khi áp dụng logic mới vẫn giữ openTime cũ.
  return menu?.status === "published"
    && now.isSameOrBefore(moment(menu.deadline));
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

    const totalGroup = Number(hasMain) + Number(hasDrink) + Number(hasSoup);

    // Không chọn gì => nghỉ ăn
    if (totalGroup === 0) {
      result.push({
        date: menuDay.date,

        mains: [],

        drink: null,

        soup: null,

        received: false,

        receivedAt: null,
      });

      continue;
    }

    // Chỉ được chọn tối đa 1 nhóm
    if (totalGroup > 1) {
      throw new Error(`Ngày ${i + 1}: Chỉ được chọn 1 nhóm.`);
    }

    // ===================================
    // MAIN
    // ===================================

    const savedMains = [];

    if (hasMain) {
      const totalQuantity = mains.reduce(
        (sum, item) => sum + Number(item.quantity),

        0,
      );

      if (totalQuantity > 2) {
        throw new Error(`Ngày ${i + 1}: Tối đa 2 phần.`);
      }

      for (const item of mains) {
        const dish = menuDay.mains.id(item.dishId);

        if (!dish) {
          throw new Error(`Ngày ${i + 1}: Món cơm không tồn tại.`);
        }

        savedMains.push({
          dishId: dish._id,

          name: dish.name,

          image: dish.image,

          quantity: item.quantity,
        });
      }
    }

    // ===================================
    // DRINK
    // ===================================

    let savedDrink = null;

    if (hasDrink) {
      const dish = menuDay.drinks.id(drink.dishId);

      if (!dish) {
        throw new Error(`Ngày ${i + 1}: Món nước không tồn tại.`);
      }

      savedDrink = {
        dishId: dish._id,

        name: dish.name,

        image: dish.image,
      };
    }

    // ===================================
    // SOUP
    // ===================================

    let savedSoup = null;

    if (hasSoup) {
      const dish = menuDay.soups.id(soup.dishId);

      if (!dish) {
        throw new Error(`Ngày ${i + 1}: Món súp không tồn tại.`);
      }

      savedSoup = {
        dishId: dish._id,

        name: dish.name,

        image: dish.image,
      };
    }

    result.push({
      date: menuDay.date,

      mains: savedMains,

      drink: savedDrink,

      soup: savedSoup,
    });
  }

  return result;
};

// ===========================================
// Verify Invite
// ===========================================

exports.verifyInvite = async (
  req,

  res,
) => {
  try {
    const { token } = req.body;

    const payload = verifyOrderToken(token);

    const user = await User.findById(payload.userId).select(
      "name email employeeId",
    );

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found.",
      });
    }

    const menu = await Menu.findById(payload.menuId);

    if (!menu) {
      return res.status(404).json({
        success: false,

        message: "Menu not found.",
      });
    }

    if (menu.status !== "published") {
      return res.status(400).json({
        success: false,

        message: "Menu chưa Publish.",
      });
    }

    return res.json({
      success: true,

      data: {
        user,

        menu,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,

      message: "Link không hợp lệ hoặc đã hết hạn.",
    });
  }
};

// ===========================================
// Create Order (Đăng nhập)
// ===========================================

exports.createOrder = async (req, res) => {
  try {
    const {
      menuId,

      days,
    } = req.body;

    const userId = req.user.id;

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Menu.",
      });
    }

    if (!canOrder(menu)) {
      return res.status(400).json({
        success: false,

        message: "Hiện không nằm trong thời gian đặt món.",
      });
    }

    if (menu.status !== "published") {
      return res.status(400).json({
        success: false,

        message: "Menu chưa được Publish.",
      });
    }

    const existed = await Order.findOne({
      user: userId,

      week: menu.week,
    });

    if (existed) {
      return res.status(400).json({
        success: false,

        message: "Bạn đã đặt món tuần này.",
      });
    }

    const orderDays = buildOrderDays(
      menu,

      days,
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
          ? `${menu.week} 식사 주문 완료`
          : `Xác nhận đặt món ${menu.week}`,
      html: orderSuccessTemplate(user, order, language),
    });

    return res.status(201).json({
      success: true,

      message: "Đặt món thành công.",

      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

// ===========================================
// Create Order From Invite
// ===========================================

exports.createOrderFromInvite = async (
  req,

  res,
) => {
  try {
    const {
      token,

      days,
    } = req.body;

    const payload = verifyOrderToken(token);

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy User.",
      });
    }

    const menu = await Menu.findById(payload.menuId);

    if (!menu) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy Menu.",
      });
    }

    if (menu.status !== "published") {
      return res.status(400).json({
        success: false,

        message: "Menu chưa Publish.",
      });
    }

    if (!canOrder(menu)) {
      return res.status(400).json({
        success: false,
        message: "Hiện không nằm trong thời gian đặt món.",
      });
    }

    const existed = await Order.findOne({
      user: user._id,

      week: menu.week,
    });

    if (existed) {
      return res.status(400).json({
        success: false,

        message: "Bạn đã đặt món tuần này.",
      });
    }

    const orderDays = buildOrderDays(
      menu,

      days,
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
          ? `${menu.week} 식사 주문 완료`
          : `Xác nhận đặt món ${menu.week}`,
      html: orderSuccessTemplate(user, order, language),
    });

    return res.status(201).json({
      success: true,

      message: "Đặt món thành công.",

      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
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

        message: "Không tìm thấy đơn đặt món.",
      });
    }

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,

        message: "Không có quyền.",
      });
    }

    const menu = await Menu.findById(order.menu);

    if (new Date() > new Date(menu.deadline)) {
      return res.status(400).json({
        success: false,

        message: "Đã hết thời gian chỉnh sửa.",
      });
    }

    if (!menu) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy Menu.",
      });
    }

    const orderDays = buildOrderDays(
      menu,

      days,
    );

    order.days = orderDays;

    await order.save();

    return res.json({
      success: true,

      message: "Cập nhật thành công.",

      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

// ===========================================
// Admin EOC Update Order
// ===========================================

exports.adminUpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt món.",
      });
    }

    const menu = await Menu.findById(order.menu);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Menu.",
      });
    }

    const updatedDays = buildOrderDays(menu, days);

    // Việc sửa món không được làm mất trạng thái nhận món hoặc đánh giá đã có.
    order.days = updatedDays.map((updatedDay) => {
      const existingDay = order.days.find(
        (day) =>
          moment(day.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") ===
          moment(updatedDay.date)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD"),
      );

      return {
        ...updatedDay,
        received: existingDay?.received || false,
        receivedAt: existingDay?.receivedAt || null,
        review: existingDay?.review || null,
      };
    });

    await order.save();

    const result = await Order.findById(order._id)
      .populate("user", "employeeId name email floor")
      .populate("menu", "week year status days deadline openTime");

    return res.json({
      success: true,
      message: "Cập nhật đơn đặt món thành công.",
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================================
// Cancel Order
// ===========================================

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy đơn.",
      });
    }

    // Chỉ chủ đơn được hủy

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,

        message: "Không có quyền.",
      });
    }

    const menu = await Menu.findById(order.menu);

    if (!canOrder(menu)) {
      return res.status(400).json({
        success: false,
        message: "Hiện không nằm trong thời gian hủy.",
      });
    }

    order.status = "cancelled";

    await order.save();

    return res.json({
      success: true,

      message: "Đã hủy đơn.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

// ===========================================
// Lịch sử đặt món của User
// ===========================================

exports.getHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })

      .populate(
        "menu",

        "week year status",
      )

      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,

      data: orders,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

// ===========================================
// Đánh giá bữa ăn
// ===========================================

exports.submitReview = async (req, res) => {
  try {
    const { orderId, date, rating, comment } = req.body;

    if (rating < 1 || rating > 10) {
      return res.status(400).json({
        success: false,

        message: "Điểm phải từ 1 đến 10.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy đơn.",
      });
    }

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,

        message: "Không có quyền.",
      });
    }

    const day = order.days.find(
      (item) =>
        moment(item.date)
          .tz("Asia/Ho_Chi_Minh")

          .format("YYYY-MM-DD") === date,
    );

    if (!day) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy ngày.",
      });
    }

    if (!day.received) {
      return res.status(400).json({
        success: false,

        message: "Bạn chưa nhận suất ăn.",
      });
    }

    if (day.review) {
      return res.status(400).json({
        success: false,

        message: "Bạn đã đánh giá.",
      });
    }

    day.review = {
      rating,

      comment,

      createdAt: new Date(),
    };

    await order.save();

    return res.json({
      success: true,

      message: "Đánh giá thành công.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

// ===========================================
// Danh sách đánh giá (Admin)
// ===========================================

exports.getReviews = async (req, res) => {
  try {
    const { week, date } = req.query;

    const filter = {};

    const userFilter = {};

    if (week) {
      filter.week = week;
    }

    if (req.user.role === "admin_floor") {
      userFilter.floor = req.user.floor;
    }

    const users = await User.find(userFilter).select("_id");

    if (req.user.role === "admin_floor") {
      filter.user = {
        $in: users.map((user) => user._id),
      };
    }

    const orders = await Order.find(filter)

      .populate(
        "user",

        "employeeId name email floor",
      )

      .sort({
        createdAt: -1,
      });

    const reviews = [];

    for (const order of orders) {
      for (const day of order.days) {
        if (!day.review) {
          continue;
        }

        const reviewDate = moment(day.date)
          .tz("Asia/Ho_Chi_Minh")

          .format("YYYY-MM-DD");

        if (date && reviewDate !== date) {
          continue;
        }

        reviews.push({
          orderId: order._id,

          week: order.week,

          date: reviewDate,

          employeeId: order.user.employeeId,

          name: order.user.name,

          email: order.user.email,

          floor: order.user.floor,

          rating: day.review.rating,

          comment: day.review.comment,

          createdAt: day.review.createdAt,
        });
      }
    }

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,

      data: reviews,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
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

        "employeeId name email",
      )

      .populate(
        "menu",

        "week year status days deadline openTime",
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy Order.",
      });
    }

    // User chỉ xem được đơn của mình

    if (
      req.user.role === "guest" &&
      String(order.user._id) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền.",
      });
    }

    return res.json({
      success: true,

      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,

      message: err.message,
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

    if (date) {
      if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        return res.json({ success: true, data: [] });
      }

      const startOfDay = moment.tz(date, "YYYY-MM-DD", "Asia/Ho_Chi_Minh");
      const endOfDay = startOfDay.clone().add(1, "day");

      // Lọc ngay tại MongoDB nhưng vẫn trả đủ 5 ngày để cửa sổ xem chi tiết
      // và các thao tác hiện tại tiếp tục hoạt động như trước.
      filter.days = {
        $elemMatch: {
          date: {
            $gte: startOfDay.toDate(),
            $lt: endOfDay.toDate(),
          },
          $or: [
            { "mains.0": { $exists: true } },
            { drink: { $ne: null } },
            { soup: { $ne: null } },
          ],
        },
      };
    }

    if (req.user.role === "admin_floor") {
      const users = await User.find({ floor: req.user.floor })
        .select("_id")
        .lean();
      const userIds = users.map((user) => user._id);
      filter.user = { $in: userIds };
    }

    const orders = await Order.find(filter)
      .populate("user", "employeeId name email floor")
      .populate("menu", "week year")
      .select("-qrToken")
      .sort({ createdAt: -1 })
      .lean();

    const result = orders
      .map((order) => {
        let selectedDay = null;

        if (date) {
          selectedDay = order.days.find(
            (day) =>
              moment(day.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") ===
              date,
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
          ...order,
          selectedDay,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          Number(b.selectedDay?.received) - Number(a.selectedDay?.received),
      );

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================================
// Danh sách người đã đặt món trong tuần chứa ngày được chọn
// ===========================================

exports.getWeekSummary = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "Ngày cần xem không hợp lệ.",
      });
    }

    const startOfWeek = moment
      .tz(date, "YYYY-MM-DD", "Asia/Ho_Chi_Minh")
      .startOf("isoWeek");
    const startOfNextWeek = startOfWeek.clone().add(1, "week");

    const filter = {
      status: "ordered",
      days: {
        $elemMatch: {
          date: {
            $gte: startOfWeek.toDate(),
            $lt: startOfNextWeek.toDate(),
          },
        },
      },
    };

    if (req.user.role === "admin_floor") {
      const users = await User.find({ floor: req.user.floor }).select("_id");
      filter.user = { $in: users.map((user) => user._id) };
    }

    const orders = await Order.find(filter)
      .populate("user", "employeeId name email floor")
      .populate("menu", "week year status days deadline openTime")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: {
        weekStart: startOfWeek.format("YYYY-MM-DD"),
        weekEnd: startOfWeek.clone().add(4, "days").format("YYYY-MM-DD"),
        orders,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===========================================
// Xóa vĩnh viễn một order (chỉ admin)
// ===========================================

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email floor",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn.",
      });
    }

    if (
      req.user.role === "admin_floor" &&
      order.user?.floor !== req.user.floor
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đơn của nhân viên tầng khác.",
      });
    }

    await order.deleteOne();

    return res.json({
      success: true,
      message: "Đã xóa order của nhân viên.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const normalizeEmployeeIds = (value) => [
  ...new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item).trim().toUpperCase())
      .filter(Boolean),
  ),
];

const prepareBulkCancel = async ({ menuId, dates, employeeIds }) => {
  const requestedIds = normalizeEmployeeIds(employeeIds);

  if (!menuId || requestedIds.length === 0 || !Array.isArray(dates) || dates.length === 0) {
    const error = new Error("Vui lòng chọn menu, ngày và nhập mã nhân viên.");
    error.status = 400;
    throw error;
  }

  const menu = await Menu.findById(menuId);

  if (!menu || menu.status !== "published") {
    const error = new Error("Không tìm thấy menu đã Publish.");
    error.status = 404;
    throw error;
  }

  const menuDates = new Set(
    menu.days.map((day) =>
      moment(day.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
    ),
  );
  const selectedDates = [...new Set(dates.map((date) => String(date)))];

  if (selectedDates.some((date) => !menuDates.has(date))) {
    const error = new Error("Ngày được chọn không thuộc menu này.");
    error.status = 400;
    throw error;
  }

  const allGuests = await User.find({ role: "guest" }).select(
    "employeeId name email floor",
  );
  const usersByEmployeeId = new Map(
    allGuests.map((user) => [String(user.employeeId).trim().toUpperCase(), user]),
  );
  const matchedUsers = requestedIds
    .map((employeeId) => usersByEmployeeId.get(employeeId))
    .filter(Boolean);
  const missingEmployeeIds = requestedIds.filter(
    (employeeId) => !usersByEmployeeId.has(employeeId),
  );

  const orders = await Order.find({
    menu: menu._id,
    user: { $in: matchedUsers.map((user) => user._id) },
    status: "ordered",
  }).populate("user", "employeeId name email floor");
  const orderUserIds = new Set(orders.map((order) => String(order.user?._id)));
  const noOrderEmployeeIds = matchedUsers
    .filter((user) => !orderUserIds.has(String(user._id)))
    .map((user) => user.employeeId);
  const selectedDateSet = new Set(selectedDates);
  const affectedOrders = [];
  const receivedDays = [];

  for (const order of orders) {
    const affectedDates = [];

    for (const day of order.days) {
      const date = moment(day.date)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD");

      if (!selectedDateSet.has(date)) continue;

      if (day.received) {
        receivedDays.push({
          employeeId: order.user?.employeeId,
          name: order.user?.name,
          date,
        });
        continue;
      }

      if (day.mains.length > 0 || day.drink || day.soup) {
        affectedDates.push(date);
      }
    }

    if (affectedDates.length > 0) {
      affectedOrders.push({ order, affectedDates });
    }
  }

  return {
    menu,
    selectedDates,
    requestedIds,
    missingEmployeeIds,
    noOrderEmployeeIds,
    receivedDays,
    affectedOrders,
  };
};

const bulkCancelResponse = (context) => ({
  menu: {
    _id: context.menu._id,
    week: context.menu.week,
    year: context.menu.year,
  },
  dates: context.selectedDates,
  requestedCount: context.requestedIds.length,
  affectedCount: context.affectedOrders.length,
  affectedUsers: context.affectedOrders.map(({ order, affectedDates }) => ({
    employeeId: order.user?.employeeId,
    name: order.user?.name,
    email: order.user?.email,
    floor: order.user?.floor,
    dates: affectedDates,
  })),
  missingEmployeeIds: context.missingEmployeeIds,
  noOrderEmployeeIds: context.noOrderEmployeeIds,
  receivedDays: context.receivedDays,
});

exports.getBulkCancelOptions = async (req, res) => {
  try {
    const menus = await Menu.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("week year days.date");

    return res.json({ success: true, data: menus });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchBulkCancelUsers = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    if (search.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escapedSearch, "i");
    const users = await User.find({
      role: "guest",
      $or: [{ name: pattern }, { email: pattern }, { employeeId: pattern }],
    })
      .select("employeeId name email floor")
      .sort({ name: 1 })
      .limit(20);

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.previewBulkCancel = async (req, res) => {
  try {
    const context = await prepareBulkCancel(req.body);
    return res.json({ success: true, data: bulkCancelResponse(context) });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.bulkCancelOrderDays = async (req, res) => {
  try {
    const context = await prepareBulkCancel(req.body);
    const selectedDateSet = new Set(context.selectedDates);
    const operations = context.affectedOrders.map(({ order }) => {
      const days = order.days.map((day) => {
        const value = day.toObject();
        const date = moment(day.date)
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD");

        if (selectedDateSet.has(date) && !day.received) {
          value.mains = [];
          value.drink = null;
          value.soup = null;
        }

        return value;
      });

      return {
        updateOne: {
          filter: { _id: order._id },
          update: { $set: { days } },
        },
      };
    });

    if (operations.length > 0) {
      await Order.bulkWrite(operations);
    }

    return res.json({
      success: true,
      message: `Đã hủy món theo ngày cho ${operations.length} nhân viên.`,
      data: bulkCancelResponse(context),
    });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAvailableUsers = async (req, res) => {
  try {
    const menus = await Menu.find({
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(2);

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Chưa có Menu Publish.",
      });
    }

    const menu = req.query.menuId
      ? menus.find((item) => String(item._id) === String(req.query.menuId))
      : menus[0];

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu không thuộc 2 menu đã Publish gần nhất.",
      });
    }

    const userFilter = {
      role: "guest",
    };

    // Admin tầng
    if (req.user.role === "admin_floor") {
      userFilter.floor = req.user.floor;
    }

    const users = await User.find(userFilter)
      .select("employeeId name email floor")
      .sort({
        employeeId: 1,
      });

    const orderedUsers = await Order.find({
      week: menu.week,
      status: "ordered",
    }).select("user");

    const orderedIds = new Set(orderedUsers.map((item) => String(item.user)));

    const result = users.filter((user) => !orderedIds.has(String(user._id)));

    const menuOptions = menus.map((item) => ({
      _id: item._id,
      week: item.week,
      year: item.year,
    }));

    return res.json({
      success: true,
      data: {
        menu,
        menus: menuOptions,
        users: result,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createManualOrder = async (req, res) => {
  try {
    const { userId, menuId, days } = req.body;

    if (!userId || !menuId || !days) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy User.",
      });
    }

    if (req.user.role === "admin_floor") {
      return res.status(403).json({
        success: false,
        message: "Admin tầng không được phép đặt hộ.",
      });
    }

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Menu.",
      });
    }

    if (menu.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Menu chưa Publish.",
      });
    }

    const existed = await Order.findOne({
      user: user._id,
      week: menu.week,
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Nhân viên đã đặt món.",
      });
    }

    const orderDays = buildOrderDays(menu, days);

    const order = await Order.create({
      user: user._id,
      menu: menu._id,
      week: menu.week,
      days: orderDays,
      status: "ordered",
    });

    return res.status(201).json({
      success: true,
      message: "Đặt món thành công.",
      data: order,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.manualCheckin = async (req, res) => {
  try {
    const { orderId, date } = req.body;

    if (!orderId || !date) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      status: "ordered",
    }).populate("user", "name email floor employeeId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn.",
      });
    }

    // Admin tầng chỉ được check-in người cùng tầng
    if (
      req.user.role === "admin_floor" &&
      order.user.floor !== req.user.floor
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền check-in nhân viên tầng khác.",
      });
    }

    const targetDate = moment(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");

    const day = order.days.find(
      (d) =>
        moment(d.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") ===
        targetDate,
    );

    if (!day) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy suất ăn của ngày này.",
      });
    }

    const hasMeal = day.mains.length > 0 || day.drink || day.soup;

    if (!hasMeal) {
      return res.status(400).json({
        success: false,
        message: "Nhân viên không đăng ký suất ăn.",
      });
    }

    if (day.received) {
      return res.status(409).json({
        success: false,
        message: "Nhân viên đã nhận suất ăn.",
      });
    }

    day.received = true;
    day.receivedAt = new Date();

    await order.save();

    const io = req.app.get("io");

    io.emit("checkin-success", {
      orderId: order._id,
      employee: {
        name: order.user.name,
        email: order.user.email,
        floor: order.user.floor,
        employeeId: order.user.employeeId,
      },
      receivedAt: day.receivedAt,
      mains: day.mains,
      drink: day.drink,
      soup: day.soup,
    });

    return res.json({
      success: true,
      message: "Check-in thành công.",
      data: {
        receivedAt: day.receivedAt,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
