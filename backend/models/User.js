const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    floor: {
      type: Number,
    },

    role: {
      type: String,
      enum: [
        "admin_eocmn",
        "admin_nexon",
        "admin_floor",
        "guest",
        "admin_nexon_order",
      ],
      default: "guest",
    },
    language: {
      type: String,

      enum: ["vi", "ko"],

      default: "vi",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    inactiveFrom: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
