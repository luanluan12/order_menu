// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({

//     host: process.env.MAIL_HOST,

//     port: process.env.MAIL_PORT,

//     secure: false,

//     auth: {

//         user: process.env.MAIL_USER,

//         pass: process.env.MAIL_PASS

//     }

// });

// // const sendMail = async ({

// //     to,

// //     subject,

// //     html

// // }) => {

// //     return transporter.sendMail({

// //         from: process.env.MAIL_FROM,

// //         to,

// //         subject,

// //         html

// //     });

// // };

// const sendMail = async ({ to, subject, html }) => {
//     console.log("sendMail called");

//     try {

//         const info = await transporter.sendMail({
//             from: process.env.MAIL_FROM,
//             to,
//             subject,
//             html
//         });

//         console.log("Mail sent:", info.messageId);

//         return info;

//     } catch (err) {

//         console.error("Send mail error:", err);

//         throw err;

//     }

// };

// module.exports = sendMail;

const dns = require("node:dns");
const nodemailer = require("nodemailer");

// Ưu tiên IPv4
dns.setDefaultResultOrder("ipv4first");

console.log("Mail Config:", {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
});

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    family: 4,
    logger: true,
    debug: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = async ({ to, subject, html }) => {
    console.log("sendMail called");

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            html,
        });

        console.log("Mail sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("Send mail error:", err);
        throw err;
    }
};

module.exports = sendMail;