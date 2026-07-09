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
    <div className="space-y-8">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-400">
                            Total Users
                        </p>

                        <h2 className="mt-3 text-4xl font-bold">
                            {dashboard.totalUsers}
                        </h2>

                    </div>

                    <div className="rounded-full bg-green-100 p-5">

                        <FaUsers
                            size={28}
                            className="text-green-600"
                        />

                    </div>

                </div>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-400">
                            Total Menus
                        </p>

                        <h2 className="mt-3 text-4xl font-bold">
                            {dashboard.totalMenus}
                        </h2>

                    </div>

                    <div className="rounded-full bg-orange-100 p-5">

                        <FaUtensils
                            size={28}
                            className="text-orange-500"
                        />

                    </div>

                </div>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-400">
                            Orders Today
                        </p>

                        <h2 className="mt-3 text-4xl font-bold">
                            {dashboard.todayOrders}
                        </h2>

                    </div>

                    <div className="rounded-full bg-blue-100 p-5">

                        <FaClipboardList
                            size={28}
                            className="text-blue-600"
                        />

                    </div>

                </div>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-400">
                            Vegetarian
                        </p>

                        <h2 className="mt-3 text-4xl font-bold">
                            {dashboard.vegetarian}
                        </h2>

                    </div>

                    <div className="rounded-full bg-emerald-100 p-5">

                        <FaLeaf
                            size={28}
                            className="text-emerald-600"
                        />

                    </div>

                </div>

            </div>

        </div>

        {/* Main Content */}

        <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold">
                        Dashboard Content
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Content sẽ bổ sung sau.
                    </p>

                </div>

                <div className="flex gap-3">

                    <input
                        placeholder="Search..."
                        className="rounded-xl border border-gray-200 px-4 py-2 outline-none"
                    />

                    <button className="rounded-xl border border-gray-200 px-5">
                        Filter
                    </button>

                </div>

            </div>

            <div className="flex h-[500px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">

                <span className="text-lg text-gray-400">
                    Dashboard Content Placeholder
                </span>

            </div>

        </div>

    </div>
);
}

export default Dashboard;