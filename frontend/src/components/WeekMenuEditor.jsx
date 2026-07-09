import { useEffect, useState } from "react";

import DayMenuEditor from "./DayMenuEditor";

function WeekMenuEditor({

    onSave

}) {

    const [week, setWeek] = useState("");

    const [days, setDays] = useState([]);

    const [currentDay, setCurrentDay] = useState(0);

    const [openTime, setOpenTime] = useState("");

    const [deadline, setDeadline] = useState("");

    const [allowedWeek, setAllowedWeek] = useState("");
    

    // ===============================
    // Generate days
    // ===============================
    useEffect(() => {

    const now = new Date();

    const getISOWeek = (date) => {

        const d = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        d.setUTCDate(
            d.getUTCDate() + 4 - (d.getUTCDay() || 7)
        );

        const yearStart = new Date(Date.UTC(
            d.getUTCFullYear(),
            0,
            1
        ));

        const week = Math.ceil(
            (((d - yearStart) / 86400000) + 1) / 7
        );

        return {

            year: d.getUTCFullYear(),

            week

        };

    };

    const next = new Date(now);

    next.setDate(
        next.getDate() + 7
    );

    const { year, week } = getISOWeek(next);

    const value =
        `${year}-W${String(week).padStart(2, "0")}`;

    setAllowedWeek(value);

    setWeek(value);

}, []);

    useEffect(() => {

        if (!week) {

            setDays([]);

            return;

        }

        generateDays(week);

    }, [week]);

    const generateDays = (weekString) => {

        const [year, weekNumber] = weekString.split("-W");

        const monday = getMonday(

            Number(year),

            Number(weekNumber)

        );

        const names = [

            "Thứ Hai",

            "Thứ Ba",

            "Thứ Tư",

            "Thứ Năm",

            "Thứ Sáu"

        ];

        const list = [];

        for (

            let i = 0;

            i < 5;

            i++

        ) {

            const date = new Date(monday);

            date.setDate(

                monday.getDate() + i

            );

            list.push({

                name: names[i],

                date,

                mains: [],

                drink: {

                    name: "",

                    image: null

                },

                soup: {

                    name: "",

                    image: null

                }

            });

        }

        setDays(list);

        setCurrentDay(0);
        // ========================
        setDays(list);

setCurrentDay(0);

// ========================
// Open Time
// Thứ 4 tuần trước 09:00
// ========================

const openDate = new Date(monday);

openDate.setDate(monday.getDate() - 5);

openDate.setHours(9, 0, 0, 0);

// ========================
// Deadline
// Thứ 6 tuần trước 16:00
// ========================

const deadlineDate = new Date(monday);

deadlineDate.setDate(monday.getDate() - 3);

deadlineDate.setHours(16, 0, 0, 0);

const formatDateTime = (date) => {

    const pad = (n) => String(n).padStart(2, "0");

    return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())}T` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
    );

};

setOpenTime(
    formatDateTime(openDate)
);

setDeadline(
    formatDateTime(deadlineDate)
);


    };

    const getMonday = (

        year,

        week

    ) => {

        const simple = new Date(

            year,

            0,

            1 + (week - 1) * 7

        );

        const day = simple.getDay();

        const monday = new Date(simple);

        if (day <= 4) {

            monday.setDate(

                simple.getDate()

                - simple.getDay()

                + 1

            );

        } else {

            monday.setDate(

                simple.getDate()

                + 8

                - simple.getDay()

            );

        }

        return monday;

    };

    // ===============================
    // Update day
    // ===============================

    const updateDay = (newDay) => {

        const clone = [...days];

        clone[currentDay] = newDay;

        setDays(clone);

    };

    // ===============================
    // Submit
    // ===============================

const submit = () => {

    if (!week) {

        alert("Vui lòng chọn tuần");

        return;

    }

    const formData = new FormData();

    // ========================
    // Week
    // ========================

    formData.append("week", week);

    formData.append(

        "year",

        Number(

            week.split("-W")[0]

        )

    );

    formData.append("openTime", openTime);

    formData.append(
    "deadline",
    deadline
);

    // ========================
    // JSON
    // ========================

    const jsonDays = days.map((day) => ({

        date: day.date,

        mains: day.mains.map((dish) => ({

            name: dish.name,

            type: dish.type || "normal",

            image:

                dish.image instanceof File

                    ? ""

                    : dish.image || ""

        })),

        drinks:

            day.drink?.name

                ? [

                    {

                        name: day.drink.name,

                        type: "drink",

                        image:

                            day.drink.image instanceof File

                                ? ""

                                : day.drink.image || ""

                    }

                ]

                : [],

        soups:

            day.soup?.name

                ? [

                    {

                        name: day.soup.name,

                        type: "soup",

                        image:

                            day.soup.image instanceof File

                                ? ""

                                : day.soup.image || ""

                    }

                ]

                : [],

        desserts: []

    }));

    formData.append(

        "days",

        JSON.stringify(jsonDays)

    );

    // ========================
    // Upload Images
    // ========================

    days.forEach((day, dayIndex) => {

        // Main

        day.mains.forEach((dish, dishIndex) => {

            if (dish.image instanceof File) {

                formData.append(

                    `main_${dayIndex}_${dishIndex}_image`,

                    dish.image

                );

            }

        });

        // Drink

        if (day.drink?.image instanceof File) {

            formData.append(

                `drink_${dayIndex}_0_image`,

                day.drink.image

            );

        }

        // Soup

        if (day.soup?.image instanceof File) {

            formData.append(

                `soup_${dayIndex}_0_image`,

                day.soup.image

            );

        }

    });

    console.log(

        JSON.stringify(jsonDays, null, 2)

    );

    onSave(formData);

};

    return (

        <div className="space-y-8">

            {/* Header */}

            <div className="rounded-2xl bg-white p-6 shadow">

                <input

                    type="week"

                    value={week}

                    min={allowedWeek}

                    max={allowedWeek}

                    onChange={(e)=>

                        setWeek(

                            e.target.value

                        )

                    }

                    className="rounded-xl border p-3"
                />

            </div>

            <div className="mt-5">

    <div className="mt-5 grid grid-cols-2 gap-6">

    <div>

        <label className="mb-3 block font-semibold">
            Mở đặt món
        </label>

        <input
            type="datetime-local"
            value={openTime}
            onChange={(e)=>setOpenTime(e.target.value)}
            className="w-full rounded-xl border p-3"
        />

    </div>

    <div>

        <label className="mb-3 block font-semibold">
            Hạn chót đặt món
        </label>

        <input
            type="datetime-local"
            value={deadline}
            onChange={(e)=>setDeadline(e.target.value)}
            className="w-full rounded-xl border p-3"
        />

    </div>

</div>


</div>

            {

                week && (

                    <div className="grid grid-cols-[220px_1fr] gap-8">

                        {/* LEFT */}

                        <div className="rounded-2xl bg-white p-4 shadow">

                            {

                                days.map(

                                    (

                                        day,

                                        index

                                    )=>(

                                        <button

                                            key={index}

                                            onClick={()=>

                                                setCurrentDay(index)

                                            }

                                            className={`mb-3 w-full rounded-xl p-4 text-left transition

                                            ${

                                                currentDay===index

                                                ?

                                                "bg-violet-600 text-white"

                                                :

                                                "bg-gray-100"

                                            }`}

                                        >

                                            <div className="font-semibold">

                                                {

                                                    day.name

                                                }

                                            </div>

                                            <div className="text-sm">

                                                {

                                                    day.date.toLocaleDateString("vi-VN")

                                                }

                                            </div>

                                        </button>

                                    )

                                )

                            }

                        </div>

                        {/* RIGHT */}

                        <div className="rounded-2xl bg-white p-8 shadow">

                            <DayMenuEditor

                                day={

                                    days[currentDay]

                                }

                                onChange={

                                    updateDay

                                }

                            />

                        </div>

                    </div>

                )

            }

            {/* Submit */}

            {

                week && (

                    <div className="flex justify-end">

                        <button

                            onClick={submit}

                            className="rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-700"

                        >

                            💾 Lưu Menu Tuần

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default WeekMenuEditor;