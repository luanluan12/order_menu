require("dotenv").config();

const sendMail = require("./utils/mail");

(async () => {

    try {

        await sendMail({

            to: "your_email@gmail.com",

            subject: "Test Food Order",

            html: "<h1>Hello</h1><p>Email test thành công.</p>"

        });

        console.log("Send mail success");

    }

    catch (err) {

        console.log(err);

    }

})();