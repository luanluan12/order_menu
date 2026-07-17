import { CalendarDays, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

function DayTabs({ days, currentDay, onChange, completed }) {

    const { t, i18n } = useTranslation();

    const getLabel = (date) => {

        const d = new Date(date);

        const locale =
            i18n.language === "ko"
                ? "ko-KR"
                : "vi-VN";

        return {

            weekday: d.toLocaleDateString(locale, {
                weekday: "long",
            }),

            day: `${d.getDate()}/${d.getMonth() + 1}`,

        };

    };

    return (

        <div className="space-y-4">

            <h2 className="text-lg font-bold text-slate-800">

                {t("select_day")}

            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

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
                                    h-[90px]
                                    min-w-[90px]
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    transition-all
                                    duration-300

                                    sm:h-[105px]
                                    sm:min-w-[105px]

                                    ${
                                        active
                                            ? "border-orange-500 bg-orange-500 shadow-lg"
                                            : "border-gray-200 bg-white shadow-sm hover:border-orange-300 hover:shadow-md"
                                    }
                                `}

                            >
{completed?.(index) && (
    <div
        className="
            absolute
            top-0
            right-0
            z-30
            translate-x-1/4
            -translate-y-1/4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-orange-500
            ring-2
            ring-white
            shadow-lg
        "
    >
        <Check
            size={15}
            strokeWidth={3}
            className="text-white"
        />
    </div>
)}

                                {/* Icon */}

                                <div
                                    className={`
                                        absolute
                                        -top-3
                                        left-1/2
                                        flex
                                        h-8
                                        w-8
                                        -translate-x-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-white

                                        sm:h-10
                                        sm:w-10

                                        ${
                                            active
                                                ? "bg-white text-orange-500"
                                                : "bg-orange-100 text-orange-500"
                                        }
                                    `}
                                >

                                    <CalendarDays size={16} />

                                </div>

                                {/* Weekday */}

                                <div
                                    className={`
                                        px-2
                                        text-center
                                        text-[10px]
                                        font-bold
                                        leading-4
                                        sm:text-xs

                                        ${
                                            active
                                                ? "text-white"
                                                : "text-gray-800"
                                        }
                                    `}
                                >

                                    {label.weekday}

                                </div>

                                {/* Date */}

                                <div
                                    className={`
                                        mt-1
                                        text-xs
                                        font-semibold
                                        sm:text-sm

                                        ${
                                            active
                                                ? "text-white"
                                                : "text-slate-500"
                                        }
                                    `}
                                >

                                    {label.day}

                                </div>

                            </button>

                        );

                    })

                }

            </div>

        </div>

    );

}

export default DayTabs;