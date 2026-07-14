const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

const checkinController = require("../controllers/checkinController");

router.get(

    "/today",

    auth,

    admin("admin_eocmn","admin_floor"),

    checkinController.getTodayQr

);

router.post(

    "/",

    auth,

    checkinController.checkIn

);

module.exports = router;