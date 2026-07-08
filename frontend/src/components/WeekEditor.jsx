import { useState } from "react";

import DayEditor from "./DayEditor";

const weekDays = [

    "Thứ Hai",

    "Thứ Ba",

    "Thứ Tư",

    "Thứ Năm",

    "Thứ Sáu"

];

const emptyDay = {

    date: "",

    mainNormal: "",

    mainNormalImage: null,

    mainVegetarian: "",

    mainVegetarianImage: null,

    drink: "",

    drinkImage: null,

    soup: "",

    soupImage: null,

    dessert: "",

    dessertImage: null

};

function WeekEditor({

    onSave,

    loading = false

}) {

    const [week, setWeek] = useState("");

    const [days, setDays] = useState(

        Array.from(

            {

                length: 5

            },

            () => ({

                ...emptyDay

            })

        )

    );

    const handleDayChange = (

        index,

        field,

        value

    ) => {

        const clone = [...days];

        clone[index][field] = value;

        setDays(clone);

    };

    const handleSave = () => {

        if (!week) {

            return alert("Chưa chọn tuần");

        }

        onSave({

            week,

            year: Number(

                week.split("-W")[0]

            ),

            days

        });

    };

    return (

        <div className="space-y-8">

            <div className="rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-3xl font-bold">

                    Menu tuần

                </h1>

                <div className="flex items-center gap-5">

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

                        className="rounded-lg border p-3"

                    />

                </div>

            </div>

            {

                days.map(

                    (

                        day,

                        index

                    ) => (

                        <div key={index}>

                            <div className="mb-3">

                                <h2 className="text-2xl font-bold text-blue-700">

                                    {

                                        weekDays[index]

                                    }

                                </h2>

                            </div>

                            <DayEditor

                                index={index}

                                day={day}

                                onChange={handleDayChange}

                            />

                        </div>

                    )

                )

            }

            <div className="flex justify-end gap-5">

                <button

                    onClick={handleSave}

                    disabled={loading}

                    className="rounded-lg bg-blue-600 px-8 py-3 text-white"

                >

                    {

                        loading

                            ? "Đang lưu..."

                            : "Lưu Draft"

                    }

                </button>

            </div>

        </div>

    );

}

export default WeekEditor;