const User = require("../models/User");
const Order = require("../models/Order");
const moment = require("moment-timezone");

exports.getDashboard = async (req, res) => {
  try {
    const userFilter = { role: "guest" };

    if (req.user.role === "admin_floor") {
      userFilter.floor = req.user.floor;
    }

    const startOfDay = moment()
      .tz("Asia/Ho_Chi_Minh")
      .startOf("day");
    const endOfDay = startOfDay.clone().add(1, "day");
    const dateRange = {
      $gte: startOfDay.toDate(),
      $lt: endOfDay.toDate(),
    };

    const floorMatch =
      req.user.role === "admin_floor"
        ? [{ $match: { "user.floor": req.user.floor } }]
        : [];

    // Hai truy vấn độc lập chạy song song. MongoDB chỉ lấy các order có món
    // trong ngày hôm nay thay vì tải toàn bộ lịch sử về Node.js để lọc.
    const [totalUsers, floorStats] = await Promise.all([
      User.countDocuments(userFilter),
      Order.aggregate([
        {
          $match: {
            status: "ordered",
            days: { $elemMatch: { date: dateRange } },
          },
        },
        { $unwind: "$days" },
        { $match: { "days.date": dateRange } },
        {
          $match: {
            $or: [
              { "days.mains.0": { $exists: true } },
              { "days.drink": { $ne: null } },
              { "days.soup": { $ne: null } },
            ],
          },
        },
        {
          $lookup: {
            from: User.collection.name,
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...floorMatch,
        {
          $group: {
            _id: "$user.floor",
            ordered: { $sum: 1 },
            received: {
              $sum: { $cond: [{ $eq: ["$days.received", true] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const floors = floorStats.map((item) => ({
      floor: item._id || 0,
      ordered: item.ordered,
      received: item.received,
      pending: item.ordered - item.received,
    }));
    const todayOrders = floors.reduce((sum, item) => sum + item.ordered, 0);
    const received = floors.reduce((sum, item) => sum + item.received, 0);

    return res.json({
      success: true,
      data: {
        totalUsers,
        todayOrders,
        received,
        pending: todayOrders - received,
        floors,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
