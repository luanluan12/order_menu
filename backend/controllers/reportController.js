const ExcelJS = require("exceljs");
const moment = require("moment-timezone");

const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");

// ======================================================
// Helpers
// ======================================================

function getCompany(email = "") {

    const e = email.toLowerCase();

    if (e.endsWith("@nexonnetworks.com")) {

        return "NEXON Networks VINA";

    }

    if (e.endsWith("@nexondv.com")) {

        return "NEXON Dev VINA";

    }

    if (e.endsWith("@nexonsv.com")) {

        return "NEXON Creative Studio VINA";

    }

    return "Khác";

}

function getFoodName(day) {

    if (!day) return "";

    const foods = [];

    (day.mains || []).forEach(item => {
        if (item.quantity > 0) {
            foods.push(`${item.name} x${item.quantity}`);
        }
    });

    if (day.drink?.name) {
        foods.push(day.drink.name);
    }

    if (day.soup?.name) {
        foods.push(day.soup.name);
    }

    return foods.join(", ");
}

// ======================================================
// Export Daily Excel
// ======================================================

exports.exportDailyExcel = async (req, res) => {

    try {

        const { date } = req.query;

        if (!date) {

            return res.status(400).json({

                message: "Vui lòng chọn ngày."

            });

        }

        const targetDate = moment(date)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD");

        // ==================================================
        // Tìm menu chứa ngày này
        // ==================================================

        const menus = await Menu.find();

        let selectedMenu = null;

        let selectedDay = null;

        for (const menu of menus) {

            const day = menu.days.find(item =>

                moment(item.date)
                    .tz("Asia/Ho_Chi_Minh")
                    .format("YYYY-MM-DD") === targetDate

            );

            if (day) {

                selectedMenu = menu;

                selectedDay = day;

                break;

            }

        }

        if (!selectedMenu) {

            return res.status(404).json({

                message: "Không tìm thấy menu của ngày này."

            });

        }

        // ==================================================
        // Danh sách món của đúng ngày
        // ==================================================

        const headers = [];

        (selectedDay.mains || []).forEach(item => {

            headers.push({

                type: "main",

                id: String(item._id),

                name: item.name

            });

        });

        (selectedDay.drinks || []).forEach(item => {

            headers.push({

                type: "drink",

                id: String(item._id),

                name: item.name

            });

        });

        (selectedDay.soups || []).forEach(item => {

            headers.push({

                type: "soup",

                id: String(item._id),

                name: item.name

            });

        });

        // ==================================================
        // Lấy Order
        // ==================================================

        let orderFilter = {
    menu: selectedMenu._id,
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

const orders = await Order.find(orderFilter)
.populate({
    path: "user",
    select: "employeeId name email floor"
})
.sort({
    "user.employeeId": 1
});

        // ==================================================
        // Workbook
        // ==================================================

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Food Ordering";

        workbook.created = new Date();

        const sheet = workbook.addWorksheet(

            "Food Report"

        );

        sheet.properties.defaultRowHeight = 24;

        // ==================================================
        // Thống kê
        // ==================================================

        const totalSummary = {};

        const floorSummary = {};

        headers.forEach(item => {

            totalSummary[item.name] = 0;

        });

        // current row

        let rowIndex = 1;

                // ==================================================
        // TITLE
        // ==================================================

        const lastColumn = headers.length + 3;

        sheet.mergeCells(
            1,
            1,
            1,
            lastColumn
        );

        sheet.getCell("A1").value =
            `BÁO CÁO THỐNG KÊ MÓN ĂN NGÀY ${moment(targetDate).format("DD/MM/YYYY")}`;

        sheet.getCell("A1").font = {

            name: "Times New Roman",

            size: 18,

            bold: true

        };

        sheet.getCell("A1").alignment = {

            horizontal: "center",

            vertical: "middle"

        };

        sheet.getRow(1).height = 30;

        // ==================================================
        // HEADER
        // ==================================================

        rowIndex = 3;

        sheet.getCell(rowIndex, 1).value = "Employee ID";

        sheet.getCell(rowIndex, 2).value = "Email";

        sheet.getCell(rowIndex, 3).value = "Floor";

        let column = 4;

        headers.forEach(item => {

            sheet.getCell(rowIndex, column).value =

                item.name;

            column++;

        });

        sheet.getRow(rowIndex).height = 45;

        sheet.getRow(rowIndex).eachCell(cell => {

            cell.font = {

                bold: true,

                name: "Times New Roman",

                size: 13

            };

            cell.alignment = {

                horizontal: "center",

                vertical: "middle",

                wrapText: true

            };

            cell.fill = {

                type: "pattern",

                pattern: "solid",

                fgColor: {

                    argb: "FFD9EAD3"

                }

            };

            cell.border = {

                top: {

                    style: "thin"

                },

                left: {

                    style: "thin"

                },

                bottom: {

                    style: "thin"

                },

                right: {

                    style: "thin"

                }

            };

        });

        // ==================================================
        // Column Width
        // ==================================================

        sheet.getColumn(1).width = 18;

        sheet.getColumn(2).width = 36;

        sheet.getColumn(3).width = 10;

        for (let i = 4; i <= lastColumn; i++) {

            sheet.getColumn(i).width = 18;

        }

        // ==================================================
        // DATA
        // ==================================================

        rowIndex++;

        for (const order of orders) {

            const day = order.days.find(

                d =>

                    moment(d.date)

                        .tz("Asia/Ho_Chi_Minh")

                        .format("YYYY-MM-DD") === targetDate

            );

            if (!day) continue;

            sheet.getCell(rowIndex, 1).value =

                order.user.employeeId;

            sheet.getCell(rowIndex, 2).value =

                order.user.email;

            sheet.getCell(rowIndex, 3).value =

                order.user.floor;

            const floor = String(order.user.floor);

            if (!floorSummary[floor]) {

                floorSummary[floor] = {};

                headers.forEach(item => {

                    floorSummary[floor][item.name] = 0;

                });

            }

            column = 4;

            headers.forEach(item => {

                let value = "";

                // =====================
                // MAIN
                // =====================

                if (item.type === "main") {

                    const found = day.mains.find(

                        m =>

                            String(m.dishId) === item.id

                    );

                    if (found) {

                        value = found.quantity;

                        totalSummary[item.name] +=

                            found.quantity;

                        floorSummary[floor][item.name] +=

                            found.quantity;

                    }

                }

                // =====================
                // DRINK
                // =====================

                else if (

                    item.type === "drink"

                ) {

                    if (

                        day.drink &&

                        String(day.drink.dishId) === item.id

                    ) {

                        value = 1;

                        totalSummary[item.name]++;

                        floorSummary[floor][item.name]++;

                    }

                }

                // =====================
                // SOUP
                // =====================

                else {

                    if (

                        day.soup &&

                        String(day.soup.dishId) === item.id

                    ) {

                        value = 1;

                        totalSummary[item.name]++;

                        floorSummary[floor][item.name]++;

                    }

                }

                sheet.getCell(

                    rowIndex,

                    column

                ).value = value;

                column++;

            });

            sheet.getRow(rowIndex)

                .eachCell(cell => {

                    cell.border = {

                        top: {

                            style: "thin"

                        },

                        left: {

                            style: "thin"

                        },

                        bottom: {

                            style: "thin"

                        },

                        right: {

                            style: "thin"

                        }

                    };

                    cell.alignment = {

                        horizontal: "center",

                        vertical: "middle"

                    };

                });

            rowIndex++;

        }

                // ==========================================
        // TỔNG SỐ LƯỢNG
        // ==========================================

        rowIndex++;

        sheet.getCell(rowIndex, 1).value = "TỔNG";

        sheet.getCell(rowIndex, 1).font = {
            bold: true,
            size: 13
        };

        let col = 4;

        headers.forEach(item => {

            sheet.getCell(rowIndex, col).value =
                totalSummary[item.name];

            sheet.getCell(rowIndex, col).font = {

                bold: true

            };

            sheet.getCell(rowIndex, col).alignment = {

                horizontal: "center"

            };

            col++;

        });

        // ==========================================
        // THỐNG KÊ THEO TẦNG
        // ==========================================

        rowIndex += 2;

        sheet.getCell(rowIndex, 1).value =
            "THỐNG KÊ THEO TẦNG";

        sheet.getCell(rowIndex, 1).font = {

            bold: true,

            size: 14

        };

        rowIndex++;

        Object.keys(floorSummary).sort().forEach(floor => {

            sheet.getCell(rowIndex, 1).value =
                `Tầng ${floor}`;

            col = 4;

            headers.forEach(item => {

                sheet.getCell(rowIndex, col).value =
                    floorSummary[floor][item.name];

                col++;

            });

            rowIndex++;

        });

        // ==========================================
        // Download
        // ==========================================

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Food_Report_${targetDate}.xlsx`
        );

        await workbook.xlsx.write(res);

        res.end();
            } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// Daily Report (JSON)
// ======================================================

exports.getDailyReport = async (req, res) => {

    try {

        const { date } = req.query;

        if (!date) {

            return res.status(400).json({

                message: "Vui lòng chọn ngày."

            });

        }

        const targetDate = moment(date)

            .tz("Asia/Ho_Chi_Minh")

            .format("YYYY-MM-DD");

        // =====================================
        // Tìm menu
        // =====================================

        const menus = await Menu.find();

        let selectedMenu = null;

        let selectedDay = null;

        for (const menu of menus) {

            const day = menu.days.find(item =>

                moment(item.date)

                    .tz("Asia/Ho_Chi_Minh")

                    .format("YYYY-MM-DD") === targetDate

            );

            if (day) {

                selectedMenu = menu;

                selectedDay = day;

                break;

            }

        }

        if (!selectedMenu) {

            return res.status(404).json({

                message: "Không tìm thấy menu."

            });

        }

        // =====================================
        // Header
        // =====================================

        const headers = [];

        (selectedDay.mains || []).forEach(item => {

            headers.push({

                type: "main",

                id: String(item._id),

                name: item.name

            });

        });

        (selectedDay.drinks || []).forEach(item => {

            headers.push({

                type: "drink",

                id: String(item._id),

                name: item.name

            });

        });

        (selectedDay.soups || []).forEach(item => {

            headers.push({

                type: "soup",

                id: String(item._id),

                name: item.name

            });

        });

        // =====================================
        // Orders
        // =====================================

        let orderFilter = {
    menu: selectedMenu._id,
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

const orders = await Order.find(orderFilter)
.populate({
    path: "user",
    select: "employeeId name email floor"
})

        .populate({

            path: "user",

            select: "employeeId name email floor"

        });

        const totals = {};

        const floors = {};

        headers.forEach(h => {

            totals[h.name] = 0;

        });

        const rows = [];

        for (const order of orders) {

            const day = order.days.find(d =>

                moment(d.date)

                    .tz("Asia/Ho_Chi_Minh")

                    .format("YYYY-MM-DD") === targetDate

            );

            if (!day) continue;

            const floor = String(order.user.floor);

            if (!floors[floor]) {

                floors[floor] = {};

                headers.forEach(h => {

                    floors[floor][h.name] = 0;

                });

            }

            const items = {};

            headers.forEach(h => {

                items[h.name] = "";

            });

            // Main

            day.mains.forEach(main => {

                const head = headers.find(

                    h =>

                        h.type === "main" &&

                        h.id === String(main.dishId)

                );

                if (head) {

                    items[head.name] = main.quantity;

                    totals[head.name] += main.quantity;

                    floors[floor][head.name] += main.quantity;

                }

            });

            // Drink

            if (day.drink) {

                const head = headers.find(

                    h =>

                        h.type === "drink" &&

                        h.id === String(day.drink.dishId)

                );

                if (head) {

                    items[head.name] = 1;

                    totals[head.name]++;

                    floors[floor][head.name]++;

                }

            }

            // Soup

            if (day.soup) {

                const head = headers.find(

                    h =>

                        h.type === "soup" &&

                        h.id === String(day.soup.dishId)

                );

                if (head) {

                    items[head.name] = 1;

                    totals[head.name]++;

                    floors[floor][head.name]++;

                }

            }

            rows.push({

                employeeId: order.user.employeeId,

                name: order.user.name,

                email: order.user.email,

                floor,

                received: day.received,

                items

            });

        }

        const floorRows = Object.keys(floors)

            .sort((a, b) => Number(a) - Number(b))

            .map(floor => ({

                floor,

                items: floors[floor]

            }));

        res.json({

            success: true,

            data: {

                date: targetDate,

                headers,

                rows,

                totals,

                floors: floorRows

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// Invoice Report (JSON)
// ======================================================

exports.getInvoiceReport = async (req, res) => {

    try {

        const {

            from,

            to

        } = req.query;

        if (!from || !to) {

            return res.status(400).json({

                success: false,

                message: "Thiếu khoảng thời gian."

            });

        }

        const fromDate = moment(from)

            .tz("Asia/Ho_Chi_Minh")

            .startOf("day");

        const toDate = moment(to)

            .tz("Asia/Ho_Chi_Minh")

            .endOf("day");

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

const orders = await Order.find(orderFilter)
.populate({
    path: "user",
    select: "employeeId name email floor"
})
.sort({
    "user.employeeId": 1
});

        const rows = [];

        const companySummary = {};

        for (const order of orders) {

            for (const day of order.days) {

                const current = moment(day.date)

                    .tz("Asia/Ho_Chi_Minh");

                if (

                    current.isBefore(fromDate) ||

                    current.isAfter(toDate)

                ) {

                    continue;

                }
                const food = getFoodName(day);

if (!food) {
    continue;
}

                const company = getCompany(

                    order.user.email

                );

                companySummary[company] =

                    (companySummary[company] || 0) + 1;

                rows.push({

                    date: current.format("DD/MM/YYYY"),

                    employeeId: order.user.employeeId,

                    name: order.user.name,

                    email: order.user.email,

                    company,

                    food,

                    floor: order.user.floor,

                    received: day.received

                });

            }

        }

        rows.sort((a, b) => {

            if (a.date === b.date) {

                return a.employeeId.localeCompare(

                    b.employeeId

                );

            }

            return moment(

                a.date,

                "DD/MM/YYYY"

            ) -

            moment(

                b.date,

                "DD/MM/YYYY"

            );

        });

        return res.json({

            success: true,

            data: {

                from,

                to,

                rows,

                summary: companySummary

            }

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================================
// Export Invoice Excel
// ======================================================

exports.exportInvoiceExcel = async (req, res) => {

    try {

        const {

            from,

            to

        } = req.query;

        if (!from || !to) {

            return res.status(400).json({

                success: false,

                message: "Thiếu khoảng thời gian."

            });

        }

        const fromDate = moment(from)

            .tz("Asia/Ho_Chi_Minh")

            .startOf("day");

        const toDate = moment(to)

            .tz("Asia/Ho_Chi_Minh")

            .endOf("day");

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

const orders = await Order.find(orderFilter)
.populate({
    path: "user",
    select: "employeeId name email floor"
})
.sort({
    "user.employeeId": 1
});

        // ==========================================
        // Chuẩn bị dữ liệu
        // ==========================================

        const rows = [];

        const companySummary = {};

        for (const order of orders) {

            for (const day of order.days) {

                const current = moment(day.date)

                    .tz("Asia/Ho_Chi_Minh");

                if (

                    current.isBefore(fromDate) ||

                    current.isAfter(toDate)

                ) {

                    continue;

                }
                const food = getFoodName(day);

if (!food) {
    continue;
}

                const company = getCompany(

                    order.user.email

                );

                companySummary[company] =

                    (companySummary[company] || 0) + 1;

                rows.push({

                    date: current.format("DD/MM/YYYY"),

                    employeeId: order.user.employeeId,

                    name: order.user.name,

                    email: order.user.email,

                    company,

                    food,

                });

            }

        }

        rows.sort((a, b) => {

            if (a.date === b.date) {

                return a.employeeId.localeCompare(

                    b.employeeId

                );

            }

            return moment(

                a.date,

                "DD/MM/YYYY"

            ) -

            moment(

                b.date,

                "DD/MM/YYYY"

            );

        });

        // ==========================================
        // Workbook
        // ==========================================

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Food Ordering";

        workbook.created = new Date();

        const sheet = workbook.addWorksheet(

            "Invoice Report"

        );

        sheet.properties.defaultRowHeight = 24;

        // ==========================================
        // Width
        // ==========================================

        sheet.columns = [

            {

                width: 15

            },

            {

                width: 18

            },

            {

                width: 28

            },

            {

                width: 38

            },

            {

                width: 30

            },

            {

                width: 45

            }

        ];

        // ==========================================
        // Title
        // ==========================================

        sheet.mergeCells("A1:F1");

        sheet.getCell("A1").value =

            `BÁO CÁO SUẤT ĂN (${moment(from).format("DD/MM/YYYY")} - ${moment(to).format("DD/MM/YYYY")})`;

        sheet.getCell("A1").font = {

            bold: true,

            size: 18,

            name: "Times New Roman"

        };

        sheet.getCell("A1").alignment = {

            horizontal: "center",

            vertical: "middle"

        };

        sheet.getRow(1).height = 30;

        // ==========================================
        // Header
        // ==========================================

        const headers = [

            "Ngày",

            "Mã nhân viên",

            "Tên nhân viên",

            "Email",

            "Tên công ty",

            "Món ăn"

        ];

        headers.forEach((item, index) => {

            const cell = sheet.getCell(

                3,

                index + 1

            );

            cell.value = item;

            cell.font = {

                bold: true,

                size: 12,

                name: "Times New Roman"

            };

            cell.alignment = {

                horizontal: "center",

                vertical: "middle",

                wrapText: true

            };

            cell.fill = {

                type: "pattern",

                pattern: "solid",

                fgColor: {

                    argb: "FFD9EAD3"

                }

            };

            cell.border = {

                top: {

                    style: "thin"

                },

                left: {

                    style: "thin"

                },

                bottom: {

                    style: "thin"

                },

                right: {

                    style: "thin"

                }

            };

        });

        let rowIndex = 4;
                // ==========================================
        // DATA
        // ==========================================

        rows.forEach(item => {

            sheet.getCell(rowIndex, 1).value = item.date;
            sheet.getCell(rowIndex, 2).value = item.employeeId;
            sheet.getCell(rowIndex, 3).value = item.name;
            sheet.getCell(rowIndex, 4).value = item.email;
            sheet.getCell(rowIndex, 5).value = item.company;
            sheet.getCell(rowIndex, 6).value = item.food;

            for (let i = 1; i <= 6; i++) {

                const cell = sheet.getCell(rowIndex, i);

                cell.font = {

                    name: "Times New Roman",

                    size: 11

                };

                cell.alignment = {

                    vertical: "middle",

                    horizontal: i === 6 ? "left" : "center",

                    wrapText: true

                };

                cell.border = {

                    top: {

                        style: "thin"

                    },

                    left: {

                        style: "thin"

                    },

                    bottom: {

                        style: "thin"

                    },

                    right: {

                        style: "thin"

                    }

                };

            }

            rowIndex++;

        });

        // ==========================================
        // SUMMARY
        // ==========================================

        rowIndex += 2;

        sheet.mergeCells(

            `A${rowIndex}:F${rowIndex}`

        );

        sheet.getCell(`A${rowIndex}`).value =

            "THỐNG KÊ THEO CÔNG TY";

        sheet.getCell(`A${rowIndex}`).font = {

            bold: true,

            size: 14,

            name: "Times New Roman"

        };

        sheet.getCell(`A${rowIndex}`).alignment = {

            horizontal: "center"

        };

        rowIndex++;

        sheet.getCell(rowIndex, 1).value =

            "Tên công ty";

        sheet.getCell(rowIndex, 2).value =

            "Số suất";

        ["A", "B"].forEach(col => {

            const cell = sheet.getCell(

                `${col}${rowIndex}`

            );

            cell.font = {

                bold: true,

                name: "Times New Roman"

            };

            cell.alignment = {

                horizontal: "center"

            };

            cell.fill = {

                type: "pattern",

                pattern: "solid",

                fgColor: {

                    argb: "FFD9EAD3"

                }

            };

            cell.border = {

                top: {

                    style: "thin"

                },

                left: {

                    style: "thin"

                },

                bottom: {

                    style: "thin"

                },

                right: {

                    style: "thin"

                }

            };

        });

        rowIndex++;

        Object.keys(companySummary)

            .sort()

            .forEach(company => {

                sheet.getCell(rowIndex, 1).value =

                    company;

                sheet.getCell(rowIndex, 2).value =

                    companySummary[company];

                for (let i = 1; i <= 2; i++) {

                    const cell = sheet.getCell(

                        rowIndex,

                        i

                    );

                    cell.border = {

                        top: {

                            style: "thin"

                        },

                        left: {

                            style: "thin"

                        },

                        bottom: {

                            style: "thin"

                        },

                        right: {

                            style: "thin"

                        }

                    };

                    cell.alignment = {

                        horizontal:

                            i === 1

                                ? "left"

                                : "center"

                    };

                }

                rowIndex++;

            });

        // ==========================================
        // Download
        // ==========================================

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            `attachment; filename=Invoice_Report_${from}_${to}.xlsx`

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};