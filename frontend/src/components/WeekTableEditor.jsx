import {

    useEffect,

    useState

} from "react";

import DishEditor from "./DishEditor";

// ==============================
// Thứ trong tuần
// ==============================

const columns = [

    "Thứ Hai",

    "Thứ Ba",

    "Thứ Tư",

    "Thứ Năm",

    "Thứ Sáu"

];

// ==============================
// Tính ngày trong tuần
// ==============================

const getWeekDates = (weekValue) => {

    if (!weekValue) return [];

    const [

        year,

        week

    ] = weekValue.split("-W");

    const simple = new Date(

        year,

        0,

        1 + (week - 1) * 7

    );

    const day = simple.getDay();

    const monday = new Date(simple);

    if (day <= 4) {

        monday.setDate(

            simple.getDate() -

            simple.getDay() +

            1

        );

    }

    else {

        monday.setDate(

            simple.getDate() +

            8 -

            simple.getDay()

        );

    }

    const dates = [];

    for (

        let i = 0;

        i < 5;

        i++

    ) {

        const d = new Date(monday);

        d.setDate(

            monday.getDate() + i

        );

        dates.push(

            d.toISOString().substring(

                0,

                10

            )

        );

    }

    return dates;

};

// ==============================
// Dish Model
// ==============================

const createDish = (

    type

) => ({

    name: "",

    type,

    image: null

});

// ==============================
// Day Model
// ==============================

const createDay = () => ({

    date: "",

    mains: [

        createDish("normal")

    ],

    drinks: [

        createDish("drink")

    ],

    soups: [

        createDish("soup")

    ],

    desserts: [

        createDish("dessert")

    ]

});

// ==============================
// Week Model
// ==============================

const createWeek = () =>

    Array.from(

        {

            length: 5

        },

        () =>

            createDay()

    );

function WeekTableEditor({


    initialData,

    onSave,

    loading = false

}) {

    const [

        week,

        setWeek

    ] = useState(

        initialData?.week ||

        ""

    );

    const [

        days,

        setDays

    ] = useState(

        initialData?.days ||

        createWeek()

    );

    // ==========================
    // Tự sinh ngày
    // ==========================

    useEffect(() => {

        if (!week) return;

        const dates =

            getWeekDates(

                week

            );

        setDays(prev =>

            prev.map(

                (

                    day,

                    index

                ) => ({

                    ...day,

                    date:

                        dates[index]

                })

            )

        );

    }, [

        week

    ]);
    // ==============================
    // Thêm món
    // ==============================

    const addDish = (

        dayIndex,

        group,

        type

    ) => {

        const clone = [...days];

        clone[dayIndex][group].push(

            createDish(type)

        );

        setDays(clone);

    };

    // ==============================
    // Xóa món
    // ==============================

    const removeDish = (

        dayIndex,

        group,

        dishIndex

    ) => {

        const clone = [...days];

        if (

            clone[dayIndex][group].length === 1

        ) {

            clone[dayIndex][group][0] =

                createDish(

                    clone[dayIndex][group][0].type

                );

        }

        else {

            clone[dayIndex][group].splice(

                dishIndex,

                1

            );

        }

        setDays(clone);

    };

    // ==============================
    // Sửa tên món
    // ==============================

    const updateDish = (

        dayIndex,

        group,

        dishIndex,

        field,

        value

    ) => {

        const clone = [...days];

        clone[dayIndex][group][dishIndex] = {

            ...clone[dayIndex][group][dishIndex],

            [field]: value

        };

        setDays(clone);

    };

    // ==============================
    // Upload ảnh
    // ==============================

    const updateImage = (

        dayIndex,

        group,

        dishIndex,

        file

    ) => {

        if (!file) return;

        const clone = [...days];

        clone[dayIndex][group][dishIndex] = {

            ...clone[dayIndex][group][dishIndex],

            image: file

        };

        setDays(clone);

    };

    // ==============================
    // Xóa ảnh
    // ==============================

    const removeImage = (

        dayIndex,

        group,

        dishIndex

    ) => {

        const clone = [...days];

        clone[dayIndex][group][dishIndex] = {

            ...clone[dayIndex][group][dishIndex],

            image: null

        };

        setDays(clone);

    };
    // ==============================
    // Render nhóm món
    // ==============================

    const renderGroup = (

        dayIndex,

        title,

        group,

        type

    ) => (

        <div className="mb-10">

            <div className="mb-4 flex items-center justify-between">

                <h3 className="text-xl font-bold">

                    {title}

                </h3>

                <button

                    type="button"

                    onClick={() =>

                        addDish(

                            dayIndex,

                            group,

                            type === "main"

                                ? "normal"

                                : type

                        )

                    }

                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"

                >

                    + Thêm món

                </button>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {

                    days[dayIndex][group].map(

                        (

                            dish,

                            dishIndex

                        ) => (

                            <DishEditor

                                key={dishIndex}

                                dish={dish}

                                type={type}

                                onChange={(

                                    field,

                                    value

                                ) =>

                                    updateDish(

                                        dayIndex,

                                        group,

                                        dishIndex,

                                        field,

                                        value

                                    )

                                }

                                onImageChange={(

                                    file

                                ) =>

                                    updateImage(

                                        dayIndex,

                                        group,

                                        dishIndex,

                                        file

                                    )

                                }

                                onRemove={() =>

                                    removeDish(

                                        dayIndex,

                                        group,

                                        dishIndex

                                    )

                                }

                                onRemoveImage={() =>

                                    removeImage(

                                        dayIndex,

                                        group,

                                        dishIndex

                                    )

                                }

                            />

                        )

                    )

                }

            </div>

        </div>

    );
    const submit = () => {

        try {
            alert("submit");

            if (!week) {

                return;

            }

            const formData = new FormData();

            formData.append(

                "week",

                week

            );

            formData.append(

                "year",

                Number(

                    week.split("-W")[0]

                )

            );

            // ==========================
            // JSON Days
            // ==========================

            const jsonDays = days.map(

                (

                    day,

                    dayIndex

                ) => ({

                    date: day.date,

                    mains: day.mains.map(

                        (

                            dish,

                            dishIndex

                        ) => ({

                            name: dish.name,

                            type: dish.type,

                            image: dish.image instanceof File

                                ? ""

                                : dish.image || ""

                        })

                    ),

                    drinks: day.drinks.map(

                        dish => ({

                            name: dish.name,

                            type: "drink",

                            image: dish.image instanceof File

                                ? ""

                                : dish.image || ""

                        })

                    ),

                    soups: day.soups.map(

                        dish => ({

                            name: dish.name,

                            type: "soup",

                            image: dish.image instanceof File

                                ? ""

                                : dish.image || ""

                        })

                    ),

                    desserts: day.desserts.map(

                        dish => ({

                            name: dish.name,

                            type: "dessert",

                            image: dish.image instanceof File

                                ? ""

                                : dish.image || ""

                        })

                    )

                })

            );

            formData.append(

                "days",

                JSON.stringify(

                    jsonDays

                )

            );

            // ==========================
            // Upload Images
            // ==========================

            days.forEach(

                (

                    day,

                    dayIndex

                ) => {

                    day.mains.forEach(

                        (

                            dish,

                            dishIndex

                        ) => {

                            if (

                                dish.image instanceof File

                            ) {

                                formData.append(

                                    `main_${dayIndex}_${dishIndex}_image`,

                                    dish.image

                                );

                            }

                        }

                    );

                    day.drinks.forEach(

                        (

                            dish,

                            dishIndex

                        ) => {

                            if (

                                dish.image instanceof File

                            ) {

                                formData.append(

                                    `drink_${dayIndex}_${dishIndex}_image`,

                                    dish.image

                                );

                            }

                        }

                    );

                    day.soups.forEach(

                        (

                            dish,

                            dishIndex

                        ) => {

                            if (

                                dish.image instanceof File

                            ) {

                                formData.append(

                                    `soup_${dayIndex}_${dishIndex}_image`,

                                    dish.image

                                );

                            }

                        }

                    );

                    day.desserts.forEach(

                        (

                            dish,

                            dishIndex

                        ) => {

                            if (

                                dish.image instanceof File

                            ) {

                                formData.append(

                                    `dessert_${dayIndex}_${dishIndex}_image`,

                                    dish.image

                                );

                            }

                        }

                    );

                }

            );
            console.log("Submit clicked");
            console.log([...formData.entries()]);
            console.log("Before onSave");

            onSave(formData);

            console.log("After onSave");

        }
        catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    // ==============================
    // Render
    // ==============================

    return (

        <div className="space-y-8">

            <div className="rounded-xl bg-white p-6 shadow">

                <div className="flex items-center gap-4">

                    <label className="font-semibold">

                        Tuần

                    </label>

                    <input

                        type="week"

                        value={week}

                        onChange={(e) =>

                            setWeek(

                                e.target.value

                            )

                        }

                        className="rounded-lg border p-2"

                    />

                </div>

            </div>

            {

                days.map(

                    (

                        day,

                        dayIndex

                    ) => (

                        <div

                            key={dayIndex}

                            className="rounded-xl bg-white p-6 shadow"

                        >

                            <div className="mb-8 border-b pb-4">

                                <h2 className="text-2xl font-bold">

                                    {

                                        columns[dayIndex]

                                    }

                                </h2>

                                <p className="mt-2 text-gray-500">

                                    {

                                        day.date

                                    }

                                </p>

                            </div>

                            {

                                renderGroup(

                                    dayIndex,

                                    "🍱 Món chính",

                                    "mains",

                                    "main"

                                )

                            }

                            {

                                renderGroup(

                                    dayIndex,

                                    "🥤 Nước",

                                    "drinks",

                                    "drink"

                                )

                            }

                            {

                                renderGroup(

                                    dayIndex,

                                    "🍲 Cháo / Súp",

                                    "soups",

                                    "soup"

                                )

                            }

                            {

                                renderGroup(

                                    dayIndex,

                                    "🍎 Tráng miệng",

                                    "desserts",

                                    "dessert"

                                )

                            }

                        </div>

                    )

                )

            }

            <div className="flex justify-end">

                <button

                    type="button"

                    disabled={loading}

                    onClick={submit}

                    className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700"

                >

                    {

                        loading

                            ?

                            "Đang lưu..."

                            :

                            "Lưu Menu"

                    }

                </button>

            </div>

        </div>

    );
    // ==============================
    // Submit
    // ==============================


}
export default WeekTableEditor;
