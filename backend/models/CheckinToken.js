const mongoose = require("mongoose");

const checkinTokenSchema = new mongoose.Schema(
    {

        floor: {
            type: Number,
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
checkinTokenSchema.index(
    {
        date: 1,
        floor: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "CheckinToken",
    checkinTokenSchema
);