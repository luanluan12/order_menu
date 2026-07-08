const mongoose = require("mongoose");

// ==========================
// Main Dish
// ==========================

const mainSelectionSchema = new mongoose.Schema({

    dishId: {

        type: mongoose.Schema.Types.ObjectId,

        required: true

    },

    name: {

        type: String,

        required: true

    },

    image: {

        type: String,

        default: ""

    },

    quantity: {

        type: Number,

        min: 1,

        max: 2,

        default: 1

    }

}, {

    _id: false

});

// ==========================
// Drink / Soup
// ==========================

const singleSelectionSchema = new mongoose.Schema({

    dishId: {

        type: mongoose.Schema.Types.ObjectId,

        required: true

    },

    name: {

        type: String,

        required: true

    },

    image: {

        type: String,

        default: ""

    }

}, {

    _id: false

});

// ==========================
// Order Day
// ==========================

const orderDaySchema = new mongoose.Schema({

    date: {

        type: Date,

        required: true

    },

    mains: {

        type: [mainSelectionSchema],

        default: []

    },

    drink: {

        type: singleSelectionSchema,

        default: null

    },

    soup: {

        type: singleSelectionSchema,

        default: null

    }

}, {

    _id: false

});

// ==========================
// Order
// ==========================

const orderSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    menu: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Menu",

        required: true

    },

    week: {

        type: String,

        required: true

    },

    days: {

        type: [orderDaySchema],

        validate: {

            validator(value) {

                return value.length === 5;

            },

            message: "Một tuần phải có đúng 5 ngày."

        }

    },

    status: {

        type: String,

        enum: [

            "ordered",

            "cancelled"

        ],

        default: "ordered"

    }

}, {

    timestamps: true

});

orderSchema.index(

    {

        user: 1,

        week: 1

    },

    {

        unique: true

    }

);

module.exports = mongoose.model(

    "Order",

    orderSchema

);