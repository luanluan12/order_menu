const mongoose = require("mongoose");

const checkinTokenSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            unique: true,
            required: true
        },

        token: {
            type: String,
            required: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CheckinToken",
    checkinTokenSchema
);