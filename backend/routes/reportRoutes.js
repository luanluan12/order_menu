const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const reportController = require("../controllers/reportController");

// ======================================
// Export Excel theo ngày
// ======================================

router.get("/export-daily", auth, reportController.exportDailyExcel);

router.get("/daily", auth, reportController.getDailyReport);

router.get("/leftover", auth, reportController.getLeftoverReport);

router.get("/leftover/export", auth, reportController.exportLeftoverExcel);

router.get("/invoice", auth, reportController.getInvoiceReport);

router.get("/invoice/export", auth, reportController.exportInvoiceExcel);

module.exports = router;
