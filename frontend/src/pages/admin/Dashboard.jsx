import { useEffect, useState } from "react";
import {
    FaUsers,
    FaClipboardList,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import { getDashboard } from "../../api/dashboardApi";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function Dashboard() {

    const [dashboard, setDashboard] = useState({

        totalUsers: 0,

        todayOrders: 0,

        received: 0,

        pending: 0,

        floors: []

    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const res = await getDashboard();

            setDashboard(res.data.data);

        }

        catch (err) {

            console.log(err);

            alert("Không tải được Dashboard");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex h-[500px] items-center justify-center">

                <h2 className="text-2xl font-bold">

                    Loading...

                </h2>

            </div>

        );

    }

    const cards = [

        {

            title: "Tổng nhân viên",

            value: dashboard.totalUsers,

            icon: <FaUsers size={28} />,

            color: "bg-green-100 text-green-600",

        },

        {

            title: "Đã đặt hôm nay",

            value: dashboard.todayOrders,

            icon: <FaClipboardList size={28} />,

            color: "bg-orange-100 text-orange-500",

        },

        {

            title: "Chưa nhận",

            value: dashboard.pending,

            icon: <FaClock size={28} />,

            color: "bg-red-100 text-red-500",

        },

        {

            title: "Đã nhận",

            value: dashboard.received,

            icon: <FaCheckCircle size={28} />,

            color: "bg-blue-100 text-blue-600",

        }

    ];

    const chartData = {

        labels: [

            "Đã nhận",

            "Chưa nhận"

        ],

        datasets: [

            {

                data: [

                    dashboard.received,

                    dashboard.pending

                ],

                backgroundColor: [

                    "#22c55e",

                    "#f97316"

                ],

                borderWidth: 0

            }

        ]

    };

    return (

        <div className="space-y-8">

            {/* Cards */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    cards.map((card, index) => (

                        <div

                            key={index}

                            className="rounded-3xl bg-white p-6 shadow-sm"

                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-400">

                                        {card.title}

                                    </p>

                                    <h2 className="mt-3 text-4xl font-bold">

                                        {card.value}

                                    </h2>

                                </div>

                                <div

                                    className={`rounded-full p-5 ${card.color}`}

                                >

                                    {card.icon}

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

            {/* Chart + Table */}

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

                {/* Doughnut */}

                <div className="rounded-3xl bg-white p-8 shadow-sm">

                    <h2 className="mb-8 text-2xl font-bold">

                        Nhận món hôm nay

                    </h2>

                    <div className="mx-auto w-[320px]">

                        <Doughnut

                            data={chartData}

                        />

                    </div>

                </div>

                {/* Floor */}

                <div className="rounded-3xl bg-white p-8 shadow-sm">

                    <h2 className="mb-6 text-2xl font-bold">

                        Thống kê theo tầng

                    </h2>

                    <table className="w-full">

                        <thead>

                            <tr className="border-b">

                                <th className="py-3 text-left">

                                    Tầng

                                </th>

                                <th>

                                    Đặt

                                </th>

                                <th>

                                    Đã nhận

                                </th>

                                <th>

                                    Chưa nhận

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                dashboard.floors.map((item) => (

                                    <tr

                                        key={item.floor}

                                        className="border-b"

                                    >

                                        <td className="py-4 font-semibold">

                                            {item.floor}

                                        </td>

                                        <td className="text-center">

                                            {item.ordered}

                                        </td>

                                        <td className="text-center text-green-600">

                                            {item.received}

                                        </td>

                                        <td className="text-center text-orange-500">

                                            {item.pending}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;