const express = require("express");
const router = express.Router();

const multer = require("multer");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const userController = require("../controllers/userController");

// ==========================
// Upload Excel
// ==========================

const upload = multer({
    dest: "uploads/"
});

// ==========================
// USER CRUD
// ==========================

// Danh sách User
router.get(
    "/",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.getUsers
);

// Thêm User
router.post(
    "/",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.createUser
);

// Cập nhật User
router.put(
    "/:id",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.updateUser
);

// Xóa User
router.delete(
    "/:id",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.deleteUser
);

// ==========================
// PASSWORD
// ==========================

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
    admin("admin_eocmn","admin_nexon"),
    userController.resetPassword
);

// ==========================
// SEARCH
// ==========================

// Tìm kiếm User
router.get(
    "/search",
    auth,
    admin("admin_eocmn", "admin_nexon"),
    userController.searchUsers
);

// Phân trang
router.get(
    "/page",
    auth,
    admin("admin_eocmn"),
    userController.pagination
);

// ==========================
// IMPORT EXCEL
// ==========================

router.post(
    "/import",
    auth,
    admin("admin_eocmn","admin_nexon"),
    upload.single("file"),
    userController.importExcel
);

router.get(
    "/template",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.downloadTemplate
);

// ==========================
// GET USER BY ID
// ==========================

router.get(
    "/:id",
    auth,
    admin("admin_eocmn","admin_nexon"),
    userController.getUserById
);

module.exports = router;