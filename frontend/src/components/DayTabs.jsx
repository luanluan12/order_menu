import { CalendarDays, Check } from "lucide-react";

function DayTabs({

    days,
    currentDay,
    onChange

}) {

    const getLabel = (date) => {

        const d = new Date(date);

        return {

            weekday: d.toLocaleDateString("vi-VN", {

                weekday: "long"

            }),

            day: d.toLocaleDateString("vi-VN", {

                day: "2-digit",
                month: "2-digit"

            })

        };

    };

    return (

        <div className="flex flex-col gap-4">

            {

                days.map((day, index) => {

                    const label = getLabel(day.date);

                    const active = currentDay === index;

                    return (

                        <button

                            key={index}

                            onClick={() => onChange(index)}

                            className={`
                                relative
                                flex
                                items-center
                                w-60
                                h-24
                                rounded-3xl
                                border
                                px-5
                                text-left
                                transition-all
                                duration-200
                                shadow-sm

                                ${
                                    active
                                        ? "border-violet-500 bg-violet-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-violet-300 hover:shadow"
                                }
                            `}

                        >

                            {/* Icon */}

                            <div

                                className={`
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    mr-4

                                    ${
                                        active
                                            ? "bg-violet-100 text-violet-600"
                                            : "bg-gray-100 text-gray-500"
                                    }
                                `}

                            >

                                <CalendarDays size={20} />

                            </div>

                            {/* Text */}

                            <div>

                                <div

                                    className={`
                                        text-lg
                                        font-bold
                                        capitalize

                                        ${
                                            active
                                                ? "text-violet-700"
                                                : "text-gray-900"
                                        }
                                    `}

                                >

                                    {label.weekday}

                                </div>

                                <div className="text-gray-500 mt-1">

                                    {label.day}

                                </div>

                            </div>

                            {/* Check */}

                            <div

                                className={`
                                    absolute
                                    right-5
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-violet-600
                                    transition

                                    ${
                                        active
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }
                                `}

                            >

                                <Check

                                    size={16}

                                    className="text-white"

                                />

                            </div>

                        </button>

                    );

                })

            }

        </div>

    );

}

export default DayTabs;