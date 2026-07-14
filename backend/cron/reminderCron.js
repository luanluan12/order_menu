const cron = require("node-cron");
const sendReminder = require("../services/reminderService");

module.exports = () => {

    cron.schedule(

        "0 3 * * 3",

        async () => {

            console.log("Running Lunch Reminder...");

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