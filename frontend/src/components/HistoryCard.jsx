function HistoryCard({ history }) {

    const getOption = (option) => {

        switch (option) {

            case 1:
                return "🍗 Cơm thường";

            case 2:
                return "🥗 Cơm chay";

            case 3:
                return "🥤 Chỉ nước";

            case 4:
                return "❌ Không ăn";

            default:
                return "-";

        }

    };

    return (

        <div className="rounded-xl border bg-white p-6 shadow">

            <div className="mb-5 flex items-center justify-between">

                <h2 className="text-xl font-bold">

                    {history.week}

                </h2>

                <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">

                    {history.status}

                </span>

            </div>

            <div className="space-y-3">

                {

                    history.days.map((day) => (

                        <div

                            key={day.orderId}

                            className="flex items-center justify-between rounded-lg border p-3"

                        >

                            <div>

                                <div className="font-semibold">

                                    {

                                        new Date(day.date)

                                            .toLocaleDateString("vi-VN", {

                                                weekday: "long",

                                                day: "2-digit",

                                                month: "2-digit"

                                            })

                                    }

                                </div>

                            </div>

                            <div>

                                {getOption(day.option)}

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default HistoryCard;