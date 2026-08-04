const { Resend } = require("resend");

const sendMail = async ({ to, subject, html }) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: result, error } = await resend.emails.send({
      from: `EOC <${process.env.MAIL_FROM}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Mail sent:", result);

    return result;
  } catch (err) {
    console.error("Send mail error:", err);
    throw err;
  }
};

module.exports = sendMail;
