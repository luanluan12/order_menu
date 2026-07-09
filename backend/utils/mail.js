const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: process.env.MAIL_HOST,

    port: process.env.MAIL_PORT,

    secure: false,

    auth: {

        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASS

    }

});

// const sendMail = async ({

//     to,

//     subject,

//     html

// }) => {

//     return transporter.sendMail({

//         from: process.env.MAIL_FROM,

//         to,

//         subject,

//         html

//     });

// };

const sendMail = async ({ to, subject, html }) => {
    console.log("sendMail called");

    try {

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            html
        });

        console.log("Mail sent:", info.messageId);

        return info;

    } catch (err) {

        console.error("Send mail error:", err);

        throw err;

    }

};

module.exports = sendMail;