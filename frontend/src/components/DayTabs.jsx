function DayTabs({

    days,

    currentDay,

    onChange

}) {

    const getLabel = (date) => {

        const d = new Date(date);

        const weekday = d.toLocaleDateString(

            "vi-VN",

            {

                weekday: "long"

            }

        );

        const day = d.toLocaleDateString(

            "vi-VN",

            {

                day: "2-digit",

                month: "2-digit"

            }

        );

        return {

            weekday,

            day

        };

    };

    return (

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

            {

                days.map(

                    (

                        day,

                        index

                    ) => {

                        const label = getLabel(

                            day.date

                        );

                        const active =

                            currentDay ===

                            index;

                        return (

                            <button

                                key={index}

                                onClick={() =>

                                    onChange(

                                        index

                                    )

                                }

                                className={`min-w-[130px] rounded-xl border p-4 transition

                                ${active

                                        ?

                                        "border-blue-600 bg-blue-600 text-white shadow-lg"

                                        :

                                        "border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50"

                                    }`}

                            >

                                <div className="text-base font-bold capitalize">

                                    {

                                        label.weekday

                                    }

                                </div>

                                <div className="mt-2 text-sm">

                                    {

                                        label.day

                                    }

                                </div>

                            </button>

                        );

                    }

                )

            }

        </div>

    );

}

export default DayTabs;