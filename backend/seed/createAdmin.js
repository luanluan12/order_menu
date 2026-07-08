const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

const User = require("../models/User");

async function createUsers() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const users = [

            {
                employeeId: "ADMIN001",
                name: "System Admin",
                email: "admin@gmail.com",
                role: "admin_eocmn",
                floor: 0
            },

            {
                employeeId: "NEXON001",
                name: "Nexon Admin",
                email: "nexon@gmail.com",
                role: "admin_nexon",
                floor: 0
            },

            {
                employeeId: "EMP001",
                name: "Nguyen Van A",
                email: "user@gmail.com",
                role: "guest",
                floor: 9
            }

        ];

        for (const item of users) {

            const exist = await User.findOne({
                email: item.email
            });

            if (exist) {

                console.log(`${item.email} already exists`);

                continue;

            }

            const password = await bcrypt.hash("123456", 10);

            await User.create({

                employeeId: item.employeeId,

                name: item.name,

                email: item.email,

                password,

                floor: item.floor,

                role: item.role

            });

            console.log(`${item.email} created`);

        }

        console.log("Seed completed");

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit(1);

    }

}

createUsers();