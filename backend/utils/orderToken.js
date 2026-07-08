const jwt = require("jsonwebtoken");

const createOrderToken = (userId, menuId) => {

    return jwt.sign(

        {

            userId,

            menuId,

            type: "order"

        },

        process.env.JWT_SECRET,

        {

            expiresIn: "7d"

        }

    );

};

const verifyOrderToken = (token) => {

    return jwt.verify(

        token,

        process.env.JWT_SECRET

    );

};

module.exports = {

    createOrderToken,

    verifyOrderToken

};