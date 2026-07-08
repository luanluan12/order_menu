import { useEffect, useState } from "react";

import DashboardCard from "../../components/HistoryCard";

import { FaFileExcel } from "react-icons/fa";
import {
    getDashboard,
    getWeeklyReport,
    exportExcel
} from "../../api/reportApi";

import { toast } from "react-toastify";

function Report() {

    const [dashboard, setDashboard] = useState({

        totalUsers: 0,

        todayOrders: 0,

        normal: 0,

        vegetarian: 0,

        cancelled: 0

    });

    const [week, setWeek] = useState("");

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadReport = async () => {

        try {

            const res = await getWeeklyReport(week);

            const data = res.data.data ?? res.data;

            setOrders(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        if (week !== "") {

            loadReport();

        }

    }, [week]);

    const handleExport = async () => {

        if (!week) {

            toast.warning("Vui lòng chọn tuần");

            return;

        }

        try {

            const res = await exportExcel(week);

            const blob = new Blob(
                [res.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `Report_${week}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success("Xuất Excel thành công");

        } catch (err) {

            toast.error("Không thể xuất Excel");

        }

    };

    const loadDashboard = async () => {

        try {

            const res = await getDashboard();

            const data = res.data.data ?? res.data;

            setDashboard(data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <div className="text-center text-xl mt-20">

                Loading...

            </div>

        );

    }

    return (

        <div>

            <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-4">

                    <label>

                        Week

                    </label>

                    <input

                        type="week"

                        value={week}

                        onChange={(e) => setWeek(e.target.value)}

                        className="border rounded-lg px-4 py-2"

                    />

                </div>

                <button

                    onClick={handleExport}

                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"

                >

                    <FaFileExcel />

                    Export Excel

                </button>

            </div>

            <h1 className="text-3xl font-bold mb-8">

                Report Dashboard

            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                <DashboardCard

                    title="Total Users"

                    value={dashboard.totalUsers}

                    color="text-blue-600"

                />

                <DashboardCard

                    title="Today's Orders"

                    value={dashboard.todayOrders}

                    color="text-green-600"

                />

                <DashboardCard

                    title="Normal Meal"

                    value={dashboard.normal}

                    color="text-orange-500"

                />

                <DashboardCard

                    title="Vegetarian"

                    value={dashboard.vegetarian}

                    color="text-emerald-600"

                />

                <DashboardCard

                    title="Cancelled"

                    value={dashboard.cancelled}

                    color="text-red-600"

                />

            </div>
            <div className="mt-10 rounded-xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3">

                                Employee

                            </th>

                            <th className="px-4 py-3">

                                Name

                            </th>

                            <th className="px-4 py-3">

                                Main

                            </th>

                            <th className="px-4 py-3">

                                Drink

                            </th>

                            <th className="px-4 py-3">

                                Soup

                            </th>

                            <th className="px-4 py-3">

                                Dessert

                            </th>

                            <th className="px-4 py-3">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            orders.length === 0 ?

                                (

                                    <tr>

                                        <td

                                            colSpan={7}

                                            className="py-10 text-center"

                                        >

                                            No Data

                                        </td>

                                    </tr>

                                )

                                :

                                orders.map(order => (

                                    <tr

                                        key={order._id}

                                        className="border-t"

                                    >

                                        <td className="px-4 py-3">

                                            {order.user.employeeId}

                                        </td>

                                        <td className="px-4 py-3">

                                            {order.user.name}

                                        </td>

                                        <td className="px-4 py-3">

                                            {

                                                order.selectedMain === "mainNormal"

                                                    ?

                                                    order.menu.mainNormal

                                                    :

                                                    order.menu.mainVegetarian

                                            }

                                        </td>

                                        <td className="px-4 py-3">

                                            {order.menu.drink}

                                        </td>

                                        <td className="px-4 py-3">

                                            {order.menu.soup}

                                        </td>

                                        <td className="px-4 py-3">

                                            {order.menu.dessert}

                                        </td>

                                        <td className="px-4 py-3">

                                            <span className="bg-blue-100 px-3 py-1 rounded">

                                                {order.status}

                                            </span>

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