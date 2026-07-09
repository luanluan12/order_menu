require("dotenv").config();

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

const app = express();

const menuRoutes = require("./routes/menuRoutes");

const orderRoutes = require("./routes/orderRoutes");

const reportRoutes = require("./routes/reportRoutes");

const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {

    res.json({
        message: "Food Ordering API Running"
    });

});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});

app.use("/api/menu", menuRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/report", reportRoutes);

app.use("/api/user", userRoutes);

app.use("/uploads", express.static("uploads"));

app.use(

    "/api/dashboard",

    dashboardRoutes

);