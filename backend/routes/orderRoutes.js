const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const orderController = require("../controllers/orderController");

// router.post(
//     "/",
//     auth,
//     orderController.createOrder
// );

// router.get(
//     "/history",
//     auth,
//     orderController.getHistory
// );

// router.put(
//     "/:id",
//     auth,
//     orderController.updateOrder
// );

// router.delete(
//     "/:id",
//     auth,
//     orderController.cancelOrder
// );

// router.post(

//     "/verify",

//     orderController.verifyInvite

// );

// router.post(

//     "/invite",

//     orderController.createOrderFromInvite

// );

// module.exports = router;

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

module.exports = router;