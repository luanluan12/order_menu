const express = require("express");
const multer = require("multer");

const router = express.Router();

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

const orderController = require("../controllers/orderController");

const reviewImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(null, true);
    }
    return callback(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP."));
  },
});

const parseReviewImage = (req, res, next) => {
  reviewImageUpload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.code === "LIMIT_FILE_SIZE"
          ? "Ảnh đánh giá không được vượt quá 5 MB."
          : error.message,
      });
    }
    return next();
  });
};

// ==========================
// Create Order
// ==========================

router.post("/", auth, orderController.createOrder);

// ==========================
// Get All Orders (Admin)
// ==========================

router.get("/", auth, orderController.getAllOrders);

// Danh sách đơn của cả tuần, dùng cho quản trị viên rà soát/xóa đơn.
router.get(
  "/week-summary",
  auth,
  admin("admin_eocmn", "admin_floor"),
  orderController.getWeekSummary,
);

router.delete(
  "/:id",
  auth,
  admin("admin_eocmn", "admin_floor"),
  orderController.deleteOrder,
);

// Admin EOC được phép chỉnh sửa đơn thay cho nhân viên, kể cả sau deadline.
router.put(
  "/admin/:id",
  auth,
  admin("admin_eocmn"),
  orderController.adminUpdateOrder,
);

// Admin EOC hủy món hàng loạt theo nhân viên và ngày, không xóa toàn bộ order.
router.get(
  "/bulk-cancel/options",
  auth,
  admin("admin_eocmn"),
  orderController.getBulkCancelOptions,
);

router.get(
  "/bulk-cancel/users",
  auth,
  admin("admin_eocmn"),
  orderController.searchBulkCancelUsers,
);

router.post(
  "/bulk-cancel/preview",
  auth,
  admin("admin_eocmn"),
  orderController.previewBulkCancel,
);

router.post(
  "/bulk-cancel",
  auth,
  admin("admin_eocmn"),
  orderController.bulkCancelOrderDays,
);

// ==========================
// Update Order
// ==========================

router.put("/:id", auth, orderController.updateOrder);

// ==========================
// Cancel Order
// ==========================

router.put("/:id/cancel", auth, orderController.cancelOrder);

// ==========================
// History
// ==========================

router.get("/history", auth, orderController.getHistory);

router.post("/review", auth, parseReviewImage, orderController.submitReview);

// ==========================
// Verify Invite
// ==========================

router.post("/verify", orderController.verifyInvite);

// ==========================
// Create Order From Invite
// ==========================

router.post("/invite", orderController.createOrderFromInvite);

// ==========================
// Reviews (Admin)
// ==========================

router.get("/reviews", auth, orderController.getReviews);

router.put("/checkin/manual", auth, orderController.manualCheckin);

// ==========================
// Manual Order (Admin)
// ==========================

router.get(
  "/manual/users",
  auth,
  admin("admin_eocmn"),
  orderController.getAvailableUsers,
);

router.post(
  "/manual",
  auth,
  admin("admin_eocmn"),
  orderController.createManualOrder,
);

router.get("/:id", auth, orderController.getOrderById);

module.exports = router;
