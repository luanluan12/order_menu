import { useEffect, useState } from "react";
import {
    FaUsers,
    FaUtensils,
    FaClipboardList,
    FaLeaf,
} from "react-icons/fa";

import { getDashboard } from "../../api/reportApi";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalMenus: 0,
        todayOrders: 0,
        normal: 0,
        vegetarian: 0,
        cancelled: 0,
    });

    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        try {
            const res = await getDashboard();

            setDashboard(res.data.data);
        } catch (err) {
            console.log(err);
            alert("Không tải được Dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <h2 className="text-2xl font-bold">Loading...</h2>
            </div>
        );
    }

    return (
        <div>

            <h1 className="mb-8 text-3xl font-bold text-gray-700">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                {/* Users */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Total Users
                            </p>

                            <h2 className="mt-2 text-4xl font-bold">

                                {dashboard.totalUsers}

                            </h2>

                        </div>

                        <FaUsers
                            size={45}
                            className="text-blue-600"
                        />

                    </div>

                </div>

                {/* Menu */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">

                                Total Menus

                            </p>

                            <h2 className="mt-2 text-4xl font-bold">

                                {dashboard.totalMenus}

                            </h2>

                        </div>

                        <FaUtensils
                            size={45}
                            className="text-green-600"
                        />

                    </div>

                </div>

                {/* Orders */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">

                                Today's Orders

                            </p>

                            <h2 className="mt-2 text-4xl font-bold">

                                {dashboard.todayOrders}

                            </h2>

                        </div>

                        <FaClipboardList
                            size={45}
                            className="text-orange-500"
                        />

                    </div>

                </div>

                {/* Vegetarian */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">

                                Vegetarian

                            </p>

                            <h2 className="mt-2 text-4xl font-bold">

                                {dashboard.vegetarian}

                            </h2>

                        </div>

                        <FaLeaf
                            size={45}
                            className="text-emerald-600"
                        />

                    </div>

                </div>

            </div>

            {/* Statistics */}

            <div className="mt-10 rounded-xl bg-white p-8 shadow">

                <h2 className="mb-5 text-xl font-bold">

                    Statistics

                </h2>

                <div className="grid grid-cols-3 gap-8">

                    <div>

                        <h3 className="text-gray-500">

                            Normal Meal

                        </h3>

                        <p className="mt-3 text-3xl font-bold text-blue-600">

                            {dashboard.normal}

                        </p>

                    </div>

                    <div>

                        <h3 className="text-gray-500">

                            Vegetarian

                        </h3>

                        <p className="mt-3 text-3xl font-bold text-green-600">

                            {dashboard.vegetarian}

                        </p>

                    </div>

                    <div>

                        <h3 className="text-gray-500">

                            Cancelled

                        </h3>

                        <p className="mt-3 text-3xl font-bold text-red-600">

                            {dashboard.cancelled}

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;