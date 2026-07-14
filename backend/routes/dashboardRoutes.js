const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

const dashboardController = require("../controllers/dashboardController");

router.get(

    "/",

    auth,

    admin("admin_eocmn","admin_nexon","admin_floor"),

    dashboardController.getDashboard

);

module.exports = router;    