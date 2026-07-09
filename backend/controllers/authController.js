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

exports.changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            oldPassword,

            newPassword

        } = req.body;

        if (!oldPassword || !newPassword) {

            return res.status(400).json({

                success: false,

                message: "Vui lòng nhập đầy đủ."

            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy tài khoản."

            });

        }

        const match = await bcrypt.compare(

            oldPassword,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                success: false,

                message: "Mật khẩu cũ không đúng."

            });

        }

        user.password = await bcrypt.hash(

            newPassword,

            10

        );

        await user.save();

        res.json({

            success: true,

            message: "Đổi mật khẩu thành công."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};