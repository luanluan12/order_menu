const bcrypt = require("bcrypt");

const User = require("../models/User");

const generateToken = require("../config/jwt");

const crypto = require("crypto");

const ResetPasswordToken = require("../models/ResetPasswordToken");

const sendMail = require("../utils/mail");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    res.json({
      token: generateToken(user),

      user: {
        id: user._id,

        name: user.name,

        role: user.role,

        floor: user.floor,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      oldPassword,

      newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,

        message: "Vui lòng nhập đầy đủ.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "Không tìm thấy tài khoản.",
      });
    }

    const match = await bcrypt.compare(
      oldPassword,

      user.password,
    );

    if (!match) {
      return res.status(400).json({
        success: false,

        message: "Mật khẩu cũ không đúng.",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,

      10,
    );

    await user.save();

    res.json({
      success: true,

      message: "Đổi mật khẩu thành công.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_REQUIRED",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_NOT_FOUND",
      });
    }

    await ResetPasswordToken.deleteMany({
      user: user._id,
    });

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await ResetPasswordToken.create({
      user: user._id,
      token,
      expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h2>Đặt lại mật khẩu</h2>

        <p>Xin chào <b>${user.name}</b>,</p>

        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản EOC Menu.</p>

        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>

        <p>
            <a
                href="${resetLink}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#A44C15;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                "
            >
                Đặt lại mật khẩu
            </a>
        </p>

        <p>Nếu nút không hoạt động, hãy mở liên kết sau:</p>

        <p>${resetLink}</p>

        <p><b>Liên kết này sẽ hết hạn sau 15 phút.</b></p>

        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    });

    return res.json({
      success: true,
      code: "RESET_PASSWORD_EMAIL_SENT",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_REQUIRED_FIELDS",
      });
    }

    const resetToken = await ResetPasswordToken.findOne({
      token,
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        code: "INVALID_RESET_TOKEN",
      });
    }

    if (resetToken.expiresAt < new Date()) {
      await ResetPasswordToken.deleteOne({
        _id: resetToken._id,
      });

      return res.status(400).json({
        success: false,
        code: "RESET_TOKEN_EXPIRED",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(resetToken.user, {
      password: hashedPassword,
    });

    await ResetPasswordToken.deleteOne({
      _id: resetToken._id,
    });

    return res.json({
      success: true,
      code: "PASSWORD_RESET_SUCCESS",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
