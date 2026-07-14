
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => ({

        folder: "food-menu",

        allowed_formats: [

            "jpg",

            "jpeg",

            "png",

            "webp"

        ],

        public_id:
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000)

    })

});

const upload = multer({

    storage

});


const menuController = require("../controllers/menuController");
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