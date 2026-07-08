const express = require("express");
const router = express.Router();

const multer = require("multer");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const userController = require("../controllers/userController");

// Upload Excel
const upload = multer({
    dest: "uploads/"
});

/**
 * ==========================
 * USER CRUD
 * ==========================
 */

// Lấy danh sách User
router.get(
    "/",
    auth,
    admin("admin_eocmn"),
    userController.getUsers
);

// Lấy User theo ID
router.get(
    "/:id",
    auth,
    admin("admin_eocmn"),
    userController.getUserById
);

// Thêm User
router.post(
    "/",
    auth,
    admin("admin_eocmn"),
    userController.createUser
);

// Cập nhật User
router.put(
    "/:id",
    auth,
    admin("admin_eocmn"),
    userController.updateUser
);

// Xóa User
router.delete(
    "/:id",
    auth,
    admin("admin_eocmn"),
    userController.deleteUser
);

/**
 * ==========================
 * PASSWORD
 * ==========================
 */

// Đổi mật khẩu
router.put(
    "/change-password",
    auth,
    userController.changePassword
);

// Reset mật khẩu
router.put(
    "/reset-password/:id",
    auth,
    admin("admin_eocmn"),
    userController.resetPassword
);

/**
 * ==========================
 * SEARCH & PAGINATION
 * ==========================
 */

// Tìm kiếm User
router.get(
    "/search",
    auth,
    admin("admin_eocmn"),
    userController.searchUsers
);

// Phân trang
router.get(
    "/page",
    auth,
    admin("admin_eocmn"),
    userController.pagination
);

/**
 * ==========================
 * IMPORT EXCEL
 * ==========================
 */

router.post(
    "/import",
    auth,
    admin("admin_eocmn"),
    upload.single("file"),
    userController.importExcel
);

module.exports = router;