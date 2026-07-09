const dotenv = require("dotenv");

dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.prod"
            : ".env.dev"
});

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ======================
// Connect MongoDB
// ======================

connectDB();

// ======================
// Middleware
// ======================

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// ======================
// Routes
// ======================

app.get("/", (req, res) => {

    res.json({
        message: "Food Ordering API Running"
    });

});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});