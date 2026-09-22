const express = require("express");
const router = express.Router();
const multer = require("multer");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { uploadMenuImage } = require("../services/r2Storage");
const menuController = require("../controllers/menuController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP."));
  },
});

const uploadImagesToR2 = async (req, res, next) => {
  try {
    req.files = await Promise.all(
      (req.files || []).map(async (file) => {
        const uploaded = await uploadMenuImage(file);

        // Giữ cấu trúc cũ để menuController không cần thay đổi luồng tạo ảnh.
        return {
          ...file,
          path: uploaded.image,
          filename: uploaded.imagePublicId,
        };
      }),
    );

    next();
  } catch (err) {
    next(err);
  }
};

router.post(
  "/",
  auth,
  admin("admin_eocmn"),
  upload.any(),
  uploadImagesToR2,
  menuController.createMenu,
);

router.get("/", auth, admin("admin_eocmn"), menuController.getMenus);

router.get("/week", auth, menuController.getWeekMenu);

router.put(
  "/:id",
  auth,
  admin("admin_eocmn"),
  upload.any(),
  uploadImagesToR2,
  menuController.updateMenu,
);

router.delete("/:id", auth, admin("admin_eocmn"), menuController.deleteMenu);

router.put(
  "/publish/:id",
  auth,
  admin("admin_eocmn"),
  menuController.publishMenu,
);

router.get("/:id", auth, admin("admin_eocmn"), menuController.getMenuById);

module.exports = router;
