import { useEffect, useState } from "react";
import {
    getFloorDailyReport,
    getFloorMonthlyReport
} from "../../api/reportApi";

import { toast } from "react-toastify";

function Report() {

    const [type, setType] = useState("daily");

    const [date, setDate] = useState("");

    const [month, setMonth] = useState("");

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);

    const loadData = async () => {

        try {

            setLoading(true);

            let res;

            if (type === "daily") {

                if (!date) {

                    toast.warning("Vui lòng chọn ngày");

                    return;

                }

                res = await getFloorDailyReport(date);

            }

            else {

                if (!month) {

                    toast.warning("Vui lòng chọn tháng");

                    return;

                }

                res = await getFloorMonthlyReport(month);

            }

            setData(res.data.data);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Không tải được dữ liệu."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (type === "daily" && date) {

            loadData();

        }

    }, [date]);

    useEffect(() => {

        if (type === "monthly" && month) {

            loadData();

        }

    }, [month]);

    const totalMeals = data.reduce(

        (sum, item) => sum + item.total,

        0

    );

    const maxFloor =

        data.length > 0

            ?

            data.reduce(

                (a, b) =>

                    a.total > b.total

                        ? a

                        : b

            )

            :

            null;

    return (

        <div className="mx-auto max-w-6xl p-8">

            {/* Filter */}

            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-6 shadow">

                <select

                    value={type}

                    onChange={(e)=>

                        setType(

                            e.target.value

                        )

                    }

                    className="rounded-xl border px-4 py-3"

                >

                    <option value="daily">

                        Theo ngày

                    </option>

                    <option value="monthly">

                        Theo tháng

                    </option>

                </select>

                {

                    type === "daily"

                    ?

                    (

                        <input

                            type="date"

                            value={date}

                            onChange={(e)=>

                                setDate(

                                    e.target.value

                                )

                            }

                            className="rounded-xl border px-4 py-3"

                        />

                    )

                    :

                    (

                        <input

                            type="month"

                            value={month}

                            onChange={(e)=>

                                setMonth(

                                    e.target.value

                                )

                            }

                            className="rounded-xl border px-4 py-3"

                        />

                    )

                }

                <button

                    onClick={loadData}

                    className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white hover:bg-violet-700"

                >

                    Thống kê

                </button>

            </div>

            {/* Summary */}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-white p-6 shadow">

                    <div className="text-gray-500">

                        Tổng tầng

                    </div>

                    <div className="mt-3 text-4xl font-bold text-violet-600">

                        {data.length}

                    </div>

                </div>

                <div className="rounded-2xl bg-white p-6 shadow">

                    <div className="text-gray-500">

                        Tổng suất

                    </div>

                    <div className="mt-3 text-4xl font-bold text-green-600">

                        {totalMeals}

                    </div>

                </div>

                <div className="rounded-2xl bg-white p-6 shadow">

                    <div className="text-gray-500">

                        Tầng nhiều nhất

                    </div>

                    <div className="mt-3 text-2xl font-bold text-orange-500">

                        {

                            maxFloor

                            ?

                            `Tầng ${maxFloor.floor}`

                            :

                            "-"

                        }

                    </div>

                    <div className="text-gray-500">

                        {

                            maxFloor

                            ?

                            `${maxFloor.total} suất`

                            :

                            ""

                        }

                    </div>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="w-full">

                    <thead className="bg-violet-50">

                        <tr>

                            <th className="p-5 text-left">

                                Tầng

                            </th>

                            <th className="p-5 text-center">

                                Số suất ăn

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan={2}

                                        className="py-20 text-center"

                                    >

                                        Đang tải...

                                    </td>

                                </tr>

                            )

                            :

                            data.length === 0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan={2}

                                        className="py-20 text-center text-gray-400"

                                    >

                                        Không có dữ liệu.

                                    </td>

                                </tr>

                            )

                            :

                            data.map(item => (

                                <tr

                                    key={item.floor}

                                    className="border-t transition hover:bg-violet-50"

                                >

                                    <td className="p-5 text-lg font-semibold">

                                        Tầng {item.floor}

                                    </td>

                                    <td className="p-5 text-center text-2xl font-bold text-violet-600">

                                        {item.total}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Report;