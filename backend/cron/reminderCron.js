const cron = require("node-cron");
const sendReminder = require("../services/reminderService");

module.exports = () => {

    cron.schedule(

        "35 11 * * 3",

        async () => {

            try {

                await sendReminder();

            }

            catch (err) {

                console.log(err);

            }

        },

        {

            timezone: "Asia/Ho_Chi_Minh"

        }

    );

};