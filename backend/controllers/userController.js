const User = require("../models/User");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const fs = require("fs");

/**
 * Lấy danh sách User
 */
exports.getUsers = async (req, res) => {

    try {

        let filter = {};

if (req.user.role === "admin_floor") {

    filter.floor = req.user.floor;

}

const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: users.length,
            data: users
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Lấy User theo ID
 */
exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/**
 * Tạo User
 */
exports.createUser = async (req, res) => {

    try {

        const {
            employeeId,
            name,
            email,
            password,
            floor,
            role,
            language
        } = req.body;

        let userFloor = floor;
let userRole = role || "guest";

if (req.user.role === "admin_floor") {

    userFloor = req.user.floor;

    userRole = "guest";

}

        if (!name || !email) {

            return res.status(400).json({
                success: false,
                message: "Name and Email are required."
            });

        }

        const emailExist = await User.findOne({ email });

        if (emailExist) {

            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });

        }

        if (employeeId) {

            const employeeExist = await User.findOne({
                employeeId
            });

            if (employeeExist) {

                return res.status(400).json({
                    success: false,
                    message: "Employee ID already exists."
                });

            }

        }

        const hashPassword = await bcrypt.hash(
            password || "123456",
            10
        );

        const user = await User.create({

            employeeId,

            name,

            email,

            password: hashPassword,

            floor: userFloor,

            role: userRole,

            language: language || "vi"

        });

        const result = user.toObject();

        delete result.password;

        res.status(201).json({

            success: true,

            message: "User created successfully.",

            data: result

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Cập nhật User
 */
exports.updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);
        if (
    req.user.role === "admin_floor" &&
    user.floor !== req.user.floor
) {

    return res.status(403).json({

        success: false,

        message: "Không có quyền."

    });

}

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (req.body.email &&
            req.body.email !== user.email) {

            const exist = await User.findOne({

                email: req.body.email

            });

            if (exist) {

                return res.status(400).json({

                    success: false,

                    message: "Email already exists."

                });

            }

            user.email = req.body.email;

        }

        if (req.body.employeeId &&
            req.body.employeeId !== user.employeeId) {

            const exist = await User.findOne({

                employeeId: req.body.employeeId

            });

            if (exist) {

                return res.status(400).json({

                    success: false,

                    message: "Employee ID already exists."

                });

            }

            user.employeeId = req.body.employeeId;

        }

        user.name = req.body.name ?? user.name;

        user.language = req.body.language ?? user.language;

        if (req.user.role === "admin_floor") {

    user.floor = req.user.floor;

    user.role = "guest";

} else {

    user.floor = req.body.floor ?? user.floor;

    user.role = req.body.role ?? user.role;

}

        await user.save();

        const result = user.toObject();

        delete result.password;

        res.status(200).json({

            success: true,

            message: "User updated successfully.",

            data: result

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Xóa User
 */
exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (
    req.user.role === "admin_floor" &&
    user.floor !== req.user.floor
) {

    return res.status(403).json({

        success: false,

        message: "Không có quyền."

    });

}

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "User deleted successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Đổi mật khẩu
 */
exports.changePassword = async (req, res) => {

    try {

        const {

            oldPassword,
            newPassword

        } = req.body;

        if (!oldPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message: "Old password and new password are required."
            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Old password is incorrect."
            });

        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        res.json({

            success: true,

            message: "Password changed successfully."

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
 * Admin reset password
 */
exports.resetPassword = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (
    req.user.role === "admin_floor" &&
    user.floor !== req.user.floor
) {

    return res.status(403).json({

        success: false,

        message: "Không có quyền."

    });

}

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        user.password = await bcrypt.hash(

            "123456",

            10

        );

        await user.save();

        res.json({

            success: true,

            message: "Password has been reset to 123456."

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
 * Search User
 *
 * GET /api/user/search?keyword=abc
 */
exports.searchUsers = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const users = await User.find({

            $or: [

                {

                    name: {

                        $regex: keyword,

                        $options: "i"

                    }

                },

                {

                    email: {

                        $regex: keyword,

                        $options: "i"

                    }

                },

                {

                    employeeId: {

                        $regex: keyword,

                        $options: "i"

                    }

                }

            ]

        })

            .select("-password")

            .sort({

                name: 1

            });

        res.json({

            success: true,

            total: users.length,

            data: users

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
 * Pagination
 *
 * GET /api/user/page?page=1&limit=10
 */
exports.pagination = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const total = await User.countDocuments();

        const users = await User.find()

            .select("-password")

            .skip(skip)

            .limit(limit)

            .sort({

                createdAt: -1

            });

        res.json({

            success: true,

            page,

            limit,

            total,

            totalPages: Math.ceil(total / limit),

            data: users

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.importExcel = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload an Excel file."
            });

        }

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {

            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                success: false,
                message: "Excel file is empty."
            });

        }

        let success = 0;
        let failed = 0;

        const errors = [];

        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];

            try {

                const employeeId = row.EmployeeID?.toString().trim();

                const name = row.Name?.toString().trim();

                const email = row.Email?.toString().trim().toLowerCase();

                const language =
    row.Language?.toString().trim().toLowerCase() === "ko"
        ? "ko"
        : "vi";

                let floor = Number(row.Floor) || 0;
                if (req.user.role === "admin_floor") {

    floor = req.user.floor;

}

let role = "guest";

if (req.user.role !== "admin_floor") {

    const roles = [
        "guest",
        "admin_eocmn",
        "admin_nexon",
        "admin_floor"
    ];

    role = roles.includes(row.Role)
        ? row.Role
        : "guest";

}

                if (!employeeId || !name || !email) {

                    failed++;

                    errors.push({

                        row: i + 2,

                        message: "Missing EmployeeID, Name or Email"

                    });

                    continue;

                }

                const existEmail = await User.findOne({
                    email
                });

                if (existEmail) {

                    failed++;

                    errors.push({

                        row: i + 2,

                        message: "Email already exists"

                    });

                    continue;

                }

                const existEmployee = await User.findOne({
                    employeeId
                });

                if (existEmployee) {

                    failed++;

                    errors.push({

                        row: i + 2,

                        message: "EmployeeID already exists"

                    });

                    continue;

                }

                const hashPassword = await bcrypt.hash(
                    "123456",
                    10
                );

                await User.create({

                    employeeId,

                    name,

                    email,

                    floor,

                    role,

                    password: hashPassword

                });

                success++;

            }

            catch (err) {

                failed++;

                errors.push({

                    row: i + 2,

                    message: err.message

                });

            }

        }

        fs.unlinkSync(req.file.path);

        res.json({

            success: true,

            imported: success,

            failed,

            errors

        });

    }

    catch (err) {

        if (req.file && fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.downloadTemplate = async (req, res) => {

    const data = [

        {

            EmployeeID: "EOC001",

            Name: "Nguyen Van A",

            Email: "a@company.com",

            Floor: 3,

            Role: "guest",

            Language: "vi"

        }

    ];

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Users"

    );

    const buffer = XLSX.write(

        workbook,

        {

            type: "buffer",

            bookType: "xlsx"

        }

    );

    res.setHeader(

        "Content-Disposition",

        "attachment; filename=User_Template.xlsx"

    );

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.send(buffer);

};