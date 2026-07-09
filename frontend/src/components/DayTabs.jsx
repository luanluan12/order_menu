import { CalendarDays } from "lucide-react";

function DayTabs({ days, currentDay, onChange }) {
    const getLabel = (date) => {
        const d = new Date(date);

        return {
            weekday: d
                .toLocaleDateString("vi-VN", {
                    weekday: "long",
                })
                .replace("Thứ ", "THỨ ")
                .replace("thứ ", "THỨ ")
                .toUpperCase(),

            day: `${d.getDate()}/${d.getMonth() + 1}`,
        };
    };

    return (
        <div className="space-y-6">

            <h2 className="font-bold text-slate-800">
                Chọn ngày đặt món
            </h2>

            <div className="flex flex-wrap gap-6">
                {days.map((day, index) => {
                    const label = getLabel(day.date);
                    const active = currentDay === index;

                    return (
                        <button
                            key={index}
                            onClick={() => onChange(index)}
                            className={`
                                relative
                                flex
                                h-[110px]
                                w-[110px]
                                flex-col
                                items-center
                                justify-center
                                rounded-[24px]
                                border
                                transition-all
                                duration-300

                                ${
                                    active
                                        ? "border-orange-500 bg-orange-500 shadow-lg"
                                        : "border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                                }
                            `}
                        >
                            {/* Icon */}

                            <div
                                className={`
                                    absolute
                                    -top-4
                                    left-1/2
                                    flex
                                    h-10
                                    w-10
                                    -translate-x-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-4
                                    border-white

                                    ${
                                        active
                                            ? "bg-white text-orange-500"
                                            : "bg-orange-100 text-orange-500"
                                    }
                                `}
                            >
                                <CalendarDays size={18} />
                            </div>

                            {/* Weekday */}

                            <div
                                className={`text-xs font-bold tracking-wide ${
                                    active
                                        ? "text-white"
                                        : "text-gray-800"
                                }`}
                            >
                                {label.weekday}
                            </div>

                            {/* Date */}

                            <div
                                className={`mt-1 text-[14px] font-semibold ${
                                    active
                                        ? "text-white"
                                        : "text-slate-500"
                                }`}
                            >
                                {label.day}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default DayTabs;