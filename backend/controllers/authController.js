const bcrypt = require("bcrypt");

const User = require("../models/User");

const generateToken = require("../config/jwt");

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Email not found"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Wrong password"
            });

        }

        res.json({

            token: generateToken(user),

            user: {

                id: user._id,

                name: user.name,

                role: user.role,

                floor: user.floor

            }

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};