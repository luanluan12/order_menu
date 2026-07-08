const Order = require("../models/Order");
const User = require("../models/User");
const Menu = require("../models/Menu");
const moment = require("moment-timezone");
const ExcelJS = require("exceljs");

/**
 * Dashboard
 */

exports.exportExcel = async (req, res) => {

    try {

        const orders = await Order.find({
            status: "ordered"
        })
            .populate("user")
            .populate("menu");

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Food Orders");

        worksheet.columns = [

            {
                header: "Employee ID",
                key: "employeeId",
                width: 20
            },

            {
                header: "Name",
                key: "name",
                width: 25
            },

            {
                header: "Email",
                key: "email",
                width: 30
            },

            {
                header: "Floor",
                key: "floor",
                width: 10
            },

            {
                header: "Date",
                key: "date",
                width: 18
            },

            {
                header: "Main",
                key: "main",
                width: 20
            },

            {
                header: "Option",
                key: "option",
                width: 10
            }

        ];

        orders.forEach(order => {

            worksheet.addRow({

                employeeId: order.user.employeeId,

                name: order.user.name,

                email: order.user.email,

                floor: order.user.floor,

                date: order.menu.date,

                main: order.selectedMain,

                option: order.option

            });

        });

        worksheet.getRow(1).font = {
            bold: true
        };

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=FoodOrders.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.dashboard = async (req, res) => {

    try {

        const today = moment().startOf("day").toDate();
        const tomorrow = moment().add(1, "day").startOf("day").toDate();

        const totalUsers = await User.countDocuments();

        const totalMenus = await Menu.countDocuments();

        const todayOrders = await Order.countDocuments({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            },
            status: "ordered"
        });

        const normal = await Order.countDocuments({
            selectedMain: "mainNormal",
            status: "ordered"
        });

        const vegetarian = await Order.countDocuments({
            selectedMain: "mainVegetarian",
            status: "ordered"
        });

        const cancelled = await Order.countDocuments({
            status: "cancelled"
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                totalMenus,
                todayOrders,
                normal,
                vegetarian,
                cancelled
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Báo cáo theo ngày
 */
exports.dailyReport = async (req, res) => {

    try {

        const report = await Order.aggregate([

            {
                $match: {
                    status: "ordered"
                }
            },

            {
                $lookup: {
                    from: "menus",
                    localField: "menu",
                    foreignField: "_id",
                    as: "menu"
                }
            },

            {
                $unwind: "$menu"
            },

            {
                $group: {

                    _id: "$menu.date",

                    totalOrders: {
                        $sum: 1
                    },

                    normal: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainNormal"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    vegetarian: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainVegetarian"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }

                }

            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.json({
            success: true,
            data: report
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Báo cáo theo tháng
 */
exports.monthlyReport = async (req, res) => {

    try {

        const report = await Order.aggregate([

            {
                $lookup: {
                    from: "menus",
                    localField: "menu",
                    foreignField: "_id",
                    as: "menu"
                }
            },

            {
                $unwind: "$menu"
            },

            {
                $group: {

                    _id: "$menu.week",

                    totalOrders: {
                        $sum: 1
                    },

                    normal: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainNormal"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    vegetarian: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainVegetarian"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }

                }

            }

        ]);

        res.json({
            success: true,
            data: report
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Báo cáo theo tầng
 */
exports.floorReport = async (req, res) => {

    try {

        const report = await Order.aggregate([

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $group: {

                    _id: "$user.floor",

                    totalOrders: {
                        $sum: 1
                    },

                    normal: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainNormal"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    vegetarian: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$selectedMain",
                                        "mainVegetarian"
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }

                }

            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.json({
            success: true,
            data: report
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Thống kê theo Option
 */
exports.optionReport = async (req, res) => {

    try {

        const report = await Order.aggregate([

            {
                $group: {

                    _id: "$option",

                    total: {
                        $sum: 1
                    }

                }

            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        res.json({

            success: true,

            data: report

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Tổng số User
 */
exports.totalUsers = async (req, res) => {

    try {

        const total = await User.countDocuments();

        res.json({

            success: true,

            total

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Tổng số Menu
 */
exports.totalMenus = async (req, res) => {

    try {

        const total = await Menu.countDocuments();

        res.json({

            success: true,

            total

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};