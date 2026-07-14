const Menu = require("../models/Menu");
const User = require("../models/User");

const moment = require("moment-timezone");

const sendMail = require("../utils/mail");
const orderMailTemplate = require("../utils/orderMailTemplate");

const {
    createOrderToken
} = require("../utils/orderToken");

const getImagePath = (req, file) => {

    if (!file) {

        return "";

    }

    return `/uploads/${file.filename}`;

};

const getFile = (

    req,

    name

) => {

    if (

        !req.files ||

        !req.files[name]

    ) {

        return null;

    }

    return req.files[name][0];

};

const buildDay = (

    req,

    index

) => {

    return {

        date:

            req.body.days[index].date,

        mainNormal:

            req.body.days[index].mainNormal,

        mainNormalImage:

            getImagePath(

                req,

                getFile(

                    req,

                    `mainNormalImage_${index}`

                )

            ),

        mainVegetarian:

            req.body.days[index].mainVegetarian,

        mainVegetarianImage:

            getImagePath(

                req,

                getFile(

                    req,

                    `mainVegetarianImage_${index}`

                )

            ),

        drink:

            req.body.days[index].drink,

        drinkImage:

            getImagePath(

                req,

                getFile(

                    req,

                    `drinkImage_${index}`

                )

            ),

        soup:

            req.body.days[index].soup,

        soupImage:

            getImagePath(

                req,

                getFile(

                    req,

                    `soupImage_${index}`

                )

            ),

        dessert:

            req.body.days[index].dessert,

        dessertImage:

            getImagePath(

                req,

                getFile(

                    req,

                    `dessertImage_${index}`

                )

            )

    };

};

const buildWeek = (req) => {

    const days = [];

    for (

        let i = 0;

        i < 5;

        i++

    ) {

        days.push(

            buildDay(

                req,

                i

            )

        );

    }

    return days;

};

exports.createMenu = async (req, res) => {

    try {

        const { week, year, openTime, deadline } = req.body;

        if (!week) {

            return res.status(400).json({

                success: false,

                message: "Week is required."

            });

        }

        const existed = await Menu.findOne({ week });

        if (existed) {

            return res.status(400).json({

                success: false,

                message: "Menu tuần đã tồn tại."

            });

        }

        let days = [];

        try {

            days = JSON.parse(req.body.days || "[]");

        } catch {

            return res.status(400).json({

                success: false,

                message: "Dữ liệu days không hợp lệ."

            });

        }

        if (days.length !== 5) {

            return res.status(400).json({

                success: false,

                message: "Một tuần phải có đúng 5 ngày."

            });

        }

        const findFile = (fieldName) => {

            return req.files.find(

                file => file.fieldname === fieldName

            );

        };

        const getImage = (fieldName) => {

            const file = findFile(fieldName);

            if (!file) return "";

            return `/uploads/menus/${file.filename}`;

        };

        const resultDays = days.map((day, dayIndex) => {
const mains = (day.mains || []).map((dish, index) => ({

    name: dish.name,

    nameKo: dish.nameKo || "",

    subtitle: dish.subtitle || "",

    vegetarian: dish.vegetarian || false,

    type: dish.type,

    image:
        getImage(`main_${dayIndex}_${index}_image`) ||
        dish.image ||
        ""

}));

            const drinks = (day.drinks || []).map((dish, index) => ({

                name: dish.name,

                nameKo: dish.nameKo || "",

                subtitle: dish.subtitle || "",

                type: "drink",

                image:

                    getImage(`drink_${dayIndex}_${index}_image`) ||

                    dish.image ||

                    ""

            }));

            const soups = (day.soups || []).map((dish, index) => ({

                name: dish.name,

                nameKo: dish.nameKo || "",

                subtitle: dish.subtitle || "",


                type: "soup",

                image:

                    getImage(`soup_${dayIndex}_${index}_image`) ||

                    dish.image ||

                    ""

            }));

            const desserts = (day.desserts || []).map((dish, index) => ({

                name: dish.name,

                nameKo: dish.nameKo || "",

                subtitle: dish.subtitle || "",

                type: "dessert",

                image:

                    getImage(`dessert_${dayIndex}_${index}_image`) ||

                    dish.image ||

                    ""

            }));

            return {

                date: day.date,

                mains,

                drinks,

                soups,

                desserts

            };

        });

        const menu = await Menu.create({

            week,

            year,

            status: "draft",

            openTime,

            deadline,

            days: resultDays

        });

        return res.status(201).json({

            success: true,

            message: "Tạo Menu tuần thành công.",

            data: menu

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Danh sách Menu tuần
 */
exports.getMenus = async (req, res) => {

    try {

        const menus = await Menu.find()

            .sort({

                year: -1,

                week: -1

            });

        return res.json({

            success: true,

            data: menus

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Lấy Menu tuần
 */
// exports.getWeekMenu = async (req,res)=>{

//     try{

//         const now = new Date();

//         const menu = await Menu.findOne({

//             status:"published",

//             openTime:{
//                 $lte:now
//             },

//             deadline:{
//                 $gte:now
//             }

//         }).lean();

//         if(!menu){

//             return res.status(404).json({

//                 success:false,

//                 message:"Hiện chưa đến thời gian đặt món."

//             });

//         }

//         res.json({

//             success:true,

//             data:menu

//         });

//     }

//     catch(err){

//         res.status(500).json({

//             success:false,

//             message:err.message

//         });

//     }

// };

exports.getWeekMenu = async (req, res) => {

    try {

        const menu = await Menu.findOne({

            status: "published"

        })
        .sort({ createdAt: -1 })
        .lean();

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Chưa có menu được Publish."

            });

        }

        return res.json({

            success: true,

            data: menu

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Cập nhật Menu tuần
 */
exports.updateMenu = async (req, res) => {

    try {

        const menu = await Menu.findById(req.params.id);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Menu."

            });

        }

        if (menu.status === "published") {

    return res.status(400).json({

        success: false,

        message: "Không thể chỉnh sửa Menu đã Publish."

    });

}

        const { week, year, status } = req.body;

        let days = [];

        try {

            days = JSON.parse(req.body.days || "[]");

        }

        catch {

            return res.status(400).json({

                success: false,

                message: "Dữ liệu days không hợp lệ."

            });

        }

        if (days.length !== 5) {

            return res.status(400).json({

                success: false,

                message: "Một tuần phải có đúng 5 ngày."

            });

        }

        const findFile = (fieldName) => {

            return req.files.find(

                file => file.fieldname === fieldName

            );

        };

        const getImage = (fieldName, oldImage = "") => {

            const file = findFile(fieldName);

            if (!file) return oldImage || "";

            return `/uploads/menus/${file.filename}`;

        };

        const resultDays = days.map((day, dayIndex) => {

            const oldDay = menu.days[dayIndex] || {};
            const mains = (day.mains || []).map((dish, index) => ({

    name: dish.name,

    nameKo: dish.nameKo || "",

    subtitle: dish.subtitle || "",

    vegetarian: dish.vegetarian || false,

    type: dish.type,

    image: getImage(
        `main_${dayIndex}_${index}_image`,
        dish.image ||
        oldDay.mains?.[index]?.image ||
        ""
    )

}));
            const drinks = (day.drinks || []).map((dish, index) => ({

                name: dish.name,
                nameKo: dish.nameKo || "",

    subtitle: dish.subtitle || "",

                type: "drink",

                image: getImage(

                    `drink_${dayIndex}_${index}_image`,

                    dish.image ||

                    oldDay.drinks?.[index]?.image ||

                    ""

                )

            }));

            const soups = (day.soups || []).map((dish, index) => ({

                name: dish.name,

                nameKo: dish.nameKo || "",

                subtitle: dish.subtitle || "",

                type: "soup",

                image: getImage(

                    `soup_${dayIndex}_${index}_image`,

                    dish.image ||

                    oldDay.soups?.[index]?.image ||

                    ""

                )

            }));

            const desserts = (day.desserts || []).map((dish, index) => ({

                name: dish.name,
                    nameKo: dish.nameKo || "",

    subtitle: dish.subtitle || "",

                type: "dessert",

                image: getImage(

                    `dessert_${dayIndex}_${index}_image`,

                    dish.image ||

                    oldDay.desserts?.[index]?.image ||

                    ""

                )

            }));

            return {

                date: day.date,

                mains,

                drinks,

                soups,

                desserts

            };

        });

        menu.week = week || menu.week;

        menu.year = year || menu.year;

        menu.status = status || menu.status;

        menu.days = resultDays;

        await menu.save();

        return res.json({

            success: true,

            message: "Cập nhật Menu thành công.",

            data: menu

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Xóa Menu tuần
 */
exports.deleteMenu = async (req, res) => {

    try {

        const menu = await Menu.findById(req.params.id);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Menu not found."

            });

        }

        await Menu.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Xóa Menu thành công."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/**
 * Publish Menu tuần
 */
exports.publishMenu = async (req, res) => {

    try {

        const menu = await Menu.findById(req.params.id);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Menu not found."

            });

        }

        if (menu.status === "published") {

            return res.status(400).json({

                success: false,

                message: "Menu đã được Publish."

            });

        }

        // Publish Menu
        menu.status = "published";

        await menu.save();

        // Lấy toàn bộ User đặt cơm
        const users = await User.find({

            role: "guest"

        });

        let sent = 0;

        // Gửi Email
        for (const user of users) {

            try {
                await sendMail({
    to: user.email,
    subject: `🍱 Thực đơn tuần ${menu.week}`,
    html: orderMailTemplate(
        user,
        menu,
        process.env.FRONTEND_URL
    )
});

                sent++;

            }

            catch (mailError) {

                console.log(

                    `Send mail failed: ${user.email}`

                );

                console.log(mailError.message);

            }

        }

        res.json({

            success: true,

            message: `Menu tuần ${menu.week} đã được Publish.`,

            sent,

            total: users.length

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.getMenuById = async (req, res) => {

    try {

        const menu = await Menu.findById(req.params.id);

        if (!menu) {

            return res.status(404).json({

                success: false,

                message: "Không tìm thấy Menu."

            });

        }

        return res.json({

            success: true,

            data: menu

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};