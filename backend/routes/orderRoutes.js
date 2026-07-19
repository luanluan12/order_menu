const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const orderController = require("../controllers/orderController");

// ==========================
// Create Order
// ==========================

router.post(
    "/",
    auth,
    orderController.createOrder
);

// ==========================
// Get All Orders (Admin)
// ==========================

router.get(
    "/",
    auth,
    orderController.getAllOrders
);

// ==========================
// Update Order
// ==========================

router.put(
    "/:id",
    auth,
    orderController.updateOrder
);

// ==========================
// Cancel Order
// ==========================

router.put(
    "/cancel",
    auth,
    orderController.cancelOrder
);

// ==========================
// History
// ==========================

router.get(
    "/history",
    auth,
    orderController.getHistory
);

router.post(
    "/review",
    auth,
    orderController.submitReview
);


// ==========================
// Verify Invite
// ==========================

router.post(
    "/verify",
    orderController.verifyInvite
);

// ==========================
// Create Order From Invite
// ==========================

router.post(
    "/invite",
    orderController.createOrderFromInvite
);

// ==========================
// Reviews (Admin)
// ==========================

router.get(
    "/reviews",
    auth,
    orderController.getReviews
);


router.get(
    "/:id",
    auth,
    orderController.getOrderById
);

module.exports = router;