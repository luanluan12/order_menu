const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

router.post("/login", authController.login);

router.put("/change-password", auth, authController.changePassword);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
