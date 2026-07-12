const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    employeeId: {
    type: String,
    unique: true,
    required: true
},

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    floor: {
        type: Number
    },

    role: {
        type: String,
        enum: [
            "admin_eocmn",
            "admin_nexon",
            "guest"
        ],
        default: "guest"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);