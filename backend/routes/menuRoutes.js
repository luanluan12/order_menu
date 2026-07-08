
const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const menuController = require("../controllers/menuController");

// =======================
// Multer Config
// =======================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/menus");

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000) +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

// =======================
// Routes
// =======================

// Tạo menu
router.post(
    "/",
    auth,
    admin("admin_eocmn"),
    upload.any(),
    menuController.createMenu
);

// Danh sách menu
router.get(
    "/",
    auth,
    admin("admin_eocmn"),
    menuController.getMenus
);

// Menu tuần cho User
router.get(
    "/week",
    auth,
    menuController.getWeekMenu
);

// Cập nhật menu
router.put(
    "/:id",
    auth,
    admin("admin_eocmn"),
    upload.any(),
    menuController.updateMenu
);

// Xóa menu
router.delete(
    "/:id",
    auth,
    admin("admin_eocmn"),
    menuController.deleteMenu
);

// Publish menu
router.put(
    "/publish/:id",
    auth,
    admin("admin_eocmn"),
    menuController.publishMenu
);

router.get(

    "/:id",

    auth,

    admin("admin_eocmn"),

    menuController.getMenuById

);

module.exports = router;