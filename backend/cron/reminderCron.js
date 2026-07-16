const cron = require("node-cron");
const sendReminder = require("../services/reminderService");

module.exports = () => {

    cron.schedule(

        "45 11 * * 4,5",

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