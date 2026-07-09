// const dns = require("node:dns");
// const nodemailer = require("nodemailer");

// // Ưu tiên IPv4
// dns.setDefaultResultOrder("ipv4first");

// console.log("Mail Config:", {
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     user: process.env.MAIL_USER,
// });

// const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: Number(process.env.MAIL_PORT),
//     secure: false,
//     family: 4,
//     logger: true,
//     debug: true,
//     connectionTimeout: 30000,
//     greetingTimeout: 30000,
//     socketTimeout: 30000,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });

// const sendMail = async ({ to, subject, html }) => {
//     console.log("sendMail called");

//     try {
//         const info = await transporter.sendMail({
//             from: process.env.MAIL_FROM,
//             to,
//             subject,
//             html,
//         });

//         console.log("Mail sent:", info.messageId);
//         return info;
//     } catch (err) {
//         console.error("Send mail error:", err);
//         throw err;
//     }
// };

// module.exports = sendMail;

const sendMail = async ({ to, subject, html }) => {
    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "Food Order System",
                    email: process.env.MAIL_FROM
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                htmlContent: html
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const result = await res.json();

        console.log("Mail sent:", result);

        return result;

    } catch (err) {

        console.error("Send mail error:", err);

        throw err;

    }
};

module.exports = sendMail;