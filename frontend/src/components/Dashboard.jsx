import { useEffect, useState } from "react";

import { getDashboard } from "../../api/dashboardApi";

function Dashboard() {

    const [data, setData] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        const res = await getDashboard();

        setData(res.data.data);

    };

    if (!data) {

        return <div>Loading...</div>;

    }

    return (

        <div className="grid grid-cols-5 gap-6">

            <Card

                title="Nhân viên"

                value={data.totalUsers}

                color="bg-blue-500"

            />

            <Card

                title="Đã đặt hôm nay"

                value={data.orderedToday}

                color="bg-green-500"

            />

            <Card

                title="Chưa đặt"

                value={data.notOrderedToday}

                color="bg-red-500"

            />

            <Card

                title="Menu"

                value={data.totalMenus}

                color="bg-purple-500"

            />

            <Card

                title="Tuần"

                value={data.currentWeek}

                color="bg-orange-500"

            />

        </div>

    );

}

function Card({

    title,

    value,

    color

}) {

    return (

        <div className={`${color} rounded-xl p-6 text-white shadow`}>

            <div className="text-sm opacity-80">

                {title}

            </div>

            <div className="mt-4 text-4xl font-bold">

                {value}

            </div>

        </div>

    );

}

export default Dashboard;