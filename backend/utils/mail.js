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