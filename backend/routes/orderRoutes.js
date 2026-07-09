const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const orderController = require("../controllers/orderController");

router.post(
    "/",
    auth,
    orderController.createOrder
);

router.put(
    "/",
    auth,
    orderController.updateOrder
);

router.put(
    "/cancel",
    auth,
    orderController.cancelOrder
);

router.get(
    "/history",
    auth,
    orderController.getHistory
);

router.post(
    "/verify",
    orderController.verifyInvite
);

router.post(
    "/invite",
    orderController.createOrderFromInvite
);

router.get(
    "/",
    auth,
    orderController.getAllOrders
);

module.exports = router;

