const Menu = require("../models/Menu");
const User = require("../models/User");

const moment = require("moment-timezone");

const sendMail = require("../utils/mail");
const orderMailTemplate = require("../utils/orderMailTemplate");
const cloudinary = require("../config/cloudinary");
const {
    createOrderToken
} = require("../utils/orderToken");

exports.createMenu = async (req, res) => {

    try {

        const {
            week,
            year,
            openTime,
            deadline
        } = req.body;

        if (!week) {

            return res.status(400).json({

                success: false,

                message: "Week is required."

            });

        }

        const existed = await Menu.findOne({

            week

        });

        if (existed) {

            return res.status(400).json({

                success: false,

                message: "Menu tuần đã tồn tại."

            });

        }

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

        const getImage = (fieldName) => {

            const file = findFile(fieldName);

            if (!file) {

                return {

                    image: "",

                    imagePublicId: ""

                };

            }

            return {

                image: file.path,

                imagePublicId: file.filename

            };

        };

        const resultDays = days.map( (day, dayIndex) => {

            const mains = (day.mains || []).map((dish, index) => {

                const imageInfo = getImage(

                    `main_${dayIndex}_${index}_image`

                );

                return {

                    name: dish.name,

                    nameKo: dish.nameKo || "",

                    subtitle: dish.subtitle || "",

                    subtitleKo: dish.subtitleKo || "",

                    vegetarian: dish.vegetarian || false,

                    type: dish.type,

                    image: imageInfo.image,

                    imagePublicId: imageInfo.imagePublicId

                };

            });

            const drinks = (day.drinks || []).map((dish, index) => {

                const imageInfo = getImage(

                    `drink_${dayIndex}_${index}_image`

                );

                return {

                    name: dish.name,

                    nameKo: dish.nameKo || "",

                    subtitle: dish.subtitle || "",

                    subtitleKo: dish.subtitleKo || "",

                    type: "drink",

                    image: imageInfo.image,

                    imagePublicId: imageInfo.imagePublicId

                };

            });

            const soups = (day.soups || []).map((dish, index) => {

                const imageInfo = getImage(

                    `soup_${dayIndex}_${index}_image`

                );

                return {

                    name: dish.name,

                    nameKo: dish.nameKo || "",

                    subtitle: dish.subtitle || "",

                    subtitleKo: dish.subtitleKo || "",

                    type: "soup",

                    image: imageInfo.image,

                    imagePublicId: imageInfo.imagePublicId

                };

            });

            const desserts = (day.desserts || []).map((dish, index) => {

                const imageInfo = getImage(

                    `dessert_${dayIndex}_${index}_image`

                );

                return {

                    name: dish.name,

                    nameKo: dish.nameKo || "",

                    subtitle: dish.subtitle || "",

                    subtitleKo: dish.subtitleKo || "",

                    type: "dessert",

                    image: imageInfo.image,

                    imagePublicId: imageInfo.imagePublicId

                };

            });

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

const destroyImage = async (publicId) => {

    if (!publicId) return;

    try {

        await cloudinary.uploader.destroy(publicId);

    }

    catch (err) {

        console.log(err.message);

    }

};

const getImage = async (

    fieldName,

    oldImage = "",

    oldPublicId = ""

) => {
    const file = findFile(fieldName);

    if (!file) {

        return {

            image: oldImage,

            imagePublicId: oldPublicId

        };

    }

    // Có upload ảnh mới

    if (oldPublicId) {

        await destroyImage(oldPublicId);

    }

    return {

        image: file.path,

        imagePublicId: file.filename

    };

};

        const resultDays = await Promise.all( days.map(async (day, dayIndex) => {

            const oldDay = menu.days[dayIndex] || {};
const mains = await Promise.all(

    (day.mains || []).map(async (dish, index) => {

        const oldDish = oldDay?.mains?.[index] || {};

        const imageInfo = await getImage(

            `main_${dayIndex}_${index}_image`,

            dish.image || oldDish.image || "",

            dish.imagePublicId ||

            oldDish.imagePublicId ||

            ""

        );

        return {

            name: dish.name,

            nameKo: dish.nameKo || "",

            subtitle: dish.subtitle || "",

            subtitleKo: dish.subtitleKo || "",

            vegetarian: dish.vegetarian || false,

            type: dish.type,

            image: imageInfo.image,

            imagePublicId: imageInfo.imagePublicId

        };

    })

);
const drinks = await Promise.all(

    (day.drinks || []).map(async (dish, index) => {

        const oldDish =

            oldDay?.drinks?.[index] || {};

        const imageInfo = await getImage(

            `drink_${dayIndex}_${index}_image`,

            dish.image ||

            oldDish.image ||

            "",

            dish.imagePublicId ||

            oldDish.imagePublicId ||

            ""

        );

        return {

            name: dish.name,

            nameKo: dish.nameKo || "",

            subtitle: dish.subtitle || "",

            subtitleKo: dish.subtitleKo || "",

            type: "drink",

            image:
    imageInfo.image ||
    oldDish.image ||
    "",

            imagePublicId:

                imageInfo.imagePublicId

        };

    })

);

const soups = await Promise.all(

    (day.soups || []).map(async (dish, index) => {

        const oldDish =

            oldDay?.soups?.[index] || {};

        const imageInfo = await getImage(

            `soup_${dayIndex}_${index}_image`,

            dish.image ||

            oldDish.image ||

            "",

            dish.imagePublicId ||

            oldDish.imagePublicId ||

            ""

        );

        return {

            name: dish.name,

            nameKo: dish.nameKo || "",

            subtitle: dish.subtitle || "",

            subtitleKo: dish.subtitleKo || "",

            type: "soup",

            image:

    imageInfo.image ||

    oldDish.image ||

    "",

            imagePublicId:

                imageInfo.imagePublicId

        };

    })

);

const desserts = await Promise.all(

    (day.desserts || []).map(async (dish, index) => {

        const oldDish =

            oldDay?.desserts?.[index] || {};

        const imageInfo = await getImage(

            `dessert_${dayIndex}_${index}_image`,

            dish.image ||

            oldDish.image ||

            "",

            dish.imagePublicId ||

            oldDish.imagePublicId ||

            ""

        );

        return {

            name: dish.name,

            nameKo: dish.nameKo || "",

            subtitle: dish.subtitle || "",

            subtitleKo: dish.subtitleKo || "",

            type: "dessert",

            image:
    imageInfo.image ||
    oldDish.image ||
    "",

            imagePublicId:

                imageInfo.imagePublicId

        };

    })

);

            return {

                date: day.date,

                mains,

                drinks,

                soups,

                desserts

            };

        }));

        menu.week = week || menu.week;

        menu.year = year || menu.year;

        menu.status = status || menu.status;

        menu.days = resultDays;
        menu.openTime = req.body.openTime || menu.openTime;

menu.deadline = req.body.deadline || menu.deadline;

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

                message: "Không tìm thấy Menu."

            });

        }

        // Xóa toàn bộ ảnh trên Cloudinary

        for (const day of menu.days) {

            const dishes = [

                ...(day.mains || []),

                ...(day.drinks || []),

                ...(day.soups || []),

                ...(day.desserts || [])

            ];

            for (const dish of dishes) {

                if (!dish.imagePublicId) continue;

                try {

                    await cloudinary.uploader.destroy(

                        dish.imagePublicId

                    );

                }

                catch (err) {

                    console.log(

                        "Delete Cloudinary:",

                        err.message

                    );

                }

            }

        }

        // Xóa Menu

        await menu.deleteOne();

        return res.json({

            success: true,

            message: "Xóa Menu thành công."

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

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