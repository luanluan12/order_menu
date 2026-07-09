const mongoose = require("mongoose");

// =========================
// Dish Schema
// =========================

const dishSchema = new mongoose.Schema({

    name: {

        type: String,

        required: true,

        trim: true

    },

    image: {

        type: String,

        default: ""

    },

    type: {

        type: String,

        enum: [

            "normal",

            "vegetarian",

            "drink",

            "soup",

            "dessert"

        ],

        required: true

    }

}, {

    _id: true

});

// =========================
// Day Menu
// =========================

const dayMenuSchema = new mongoose.Schema({

    date: {

        type: Date,

        required: true

    },

    mains: {

        type: [dishSchema],

        default: []

    },

    drinks: {

        type: [dishSchema],

        default: []

    },

    soups: {

        type: [dishSchema],

        default: []

    },

    desserts: {

        type: [dishSchema],

        default: []

    }

}, {

    _id: true

});

// =========================
// Week Menu
// =========================

const menuSchema = new mongoose.Schema({

    week: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },

    year: {

        type: Number,

        required: true

    },

    status: {

        type: String,

        enum: [

            "draft",

            "published",

            "closed"

        ],

        default: "draft"

    },

    days: {

        type: [dayMenuSchema],

        validate: {

            validator(value) {

                return value.length === 5;

            },

            message: "Một tuần phải có đúng 5 ngày."

        }

    },
    openTime: {
    type: Date,
    required: true
},
    deadline: {

    type: Date,

    required: true

},


}, {

    timestamps: true

});

module.exports = mongoose.model(

    "Menu",

    menuSchema

);