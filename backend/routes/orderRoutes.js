const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

const orderController = require("../controllers/orderController");

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

// ==========================
// Update Order
// ==========================

router.put("/:id", auth, orderController.updateOrder);

// ==========================
// Cancel Order
// ==========================

router.put("/cancel", auth, orderController.cancelOrder);

// ==========================
// History
// ==========================

router.get("/history", auth, orderController.getHistory);

router.post("/review", auth, orderController.submitReview);

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

router.get("/manual/users", auth, orderController.getAvailableUsers);

router.post("/manual", auth, orderController.createManualOrder);

router.get("/:id", auth, orderController.getOrderById);

module.exports = router;
