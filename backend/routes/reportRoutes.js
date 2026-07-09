const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

const authorize = require("../middleware/authorize");

const reportController = require("../controllers/reportController");

router.get(

    "/dashboard",

    auth,

    admin("admin_nexon", "admin_eocmn"),

    reportController.dashboard

);

router.get(

    "/daily",

    auth,

    admin("admin_nexon", "admin_eocmn"),

    reportController.dailyReport

);

router.get(

    "/monthly",

    auth,

    admin("admin_nexon", "admin_eocmn"),

    reportController.monthlyReport

);

router.get(

    "/floor",

    auth,

    admin("admin_nexon", "admin_eocmn"),

    reportController.floorReport

);

router.get(
    "/export",
    auth,
    admin("admin_eocmn", "admin_nexon"),
    reportController.exportExcel
);

router.get(

    "/floor/daily",

    auth,

    reportController.floorDailyReport

);

router.get(

    "/floor/monthly",

    auth,

    reportController.floorMonthlyReport

);
module.exports = router;