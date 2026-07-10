import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipboardList, CalendarDays } from "lucide-react";
import { getHistory } from "../../api/orderApi";

const API_URL = import.meta.env.VITE_API_URL;

function History() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await getHistory();
            setOrders(res.data.data);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Không tải được lịch sử."
            );
        }
    };

    const formatDay = (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
        });

    return (
        <div className="mx-auto max-w-[1080px] px-8 py-8">

            {/* Header */}

            <div className="mb-10">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">

                        <ClipboardList size={28} />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">
                            Lịch sử đặt món
                        </h1>

                    </div>

                </div>

            </div>

            {orders.length === 0 ? (

                <div className="rounded-3xl bg-white p-16 text-center shadow">

                    <ClipboardList
                        size={60}
                        className="mx-auto text-orange-300"
                    />

                    <h2 className="mt-6 text-2xl font-bold text-slate-700">
                        Chưa có đơn đặt món
                    </h2>

                </div>

            ) : (

                <div className="space-y-8">

                    {orders.map((order) => (

                        <div
                            key={order._id}
                            className="rounded-[28px] bg-white p-8 shadow"
                        >

                            {/* Week */}

                            <div className="mb-8 flex items-center justify-between">

                                <div>

                                    <h2 className="text-3xl font-bold text-slate-800">
                                        {order.week}
                                    </h2>

                                    <div className="mt-2 flex items-center gap-2 text-gray-500">

                                        <CalendarDays size={16} />

                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("vi-VN")}

                                    </div>

                                </div>

                                <span
                                    className={`rounded-full px-5 py-2 font-semibold

                                    ${
                                        order.status === "ordered"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {order.status === "ordered"
                                        ? "Đã đặt"
                                        : "Đã hủy"}
                                </span>

                            </div>

                            {/* Days */}

                            <div className="space-y-5">

                                {order.days.map((day) => (

                                    <div
                                        key={day._id || day.date}
                                        className="rounded-3xl border border-orange-100 bg-orange-50 p-5"
                                    >

                                        <div className="mb-4 text-lg font-bold text-slate-800">

                                            {formatDay(day.date)}

                                        </div>

                                        {/* Main */}

                                        {day.mains.map((dish) => (

                                            <div
                                                key={
                                                    dish.dishId ||
                                                    dish.name
                                                }
                                                className="mb-3 flex items-center justify-between rounded-2xl bg-white p-3"
                                            >

                                                <div className="flex items-center gap-4">

                                                    <img
                                                        src={
                                                            dish.image
                                                                ? API_URL +
                                                                  dish.image
                                                                : "https://placehold.co/72"
                                                        }
                                                        className="h-[72px] w-[72px] rounded-2xl object-cover"
                                                    />

                                                    <div>

                                                        <h3 className="text-lg font-bold text-slate-800">
                                                            {dish.name}
                                                        </h3>

                                                        <p className="text-sm text-gray-500">
                                                            Món cơm
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-600">

                                                    ×{dish.quantity}

                                                </div>

                                            </div>

                                        ))}

                                        {/* Drink */}

                                        {day.drink && (

                                            <div className="mb-3 flex items-center gap-4 rounded-2xl bg-white p-3">

                                                <img
                                                    src={
                                                        day.drink.image
                                                            ? API_URL +
                                                              day.drink.image
                                                            : "https://placehold.co/72"
                                                    }
                                                    className="h-[72px] w-[72px] rounded-2xl object-cover"
                                                />

                                                <div>

                                                    <h3 className="text-lg font-bold">
                                                        {day.drink.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        🥤 Món nước
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                        {/* Soup */}

                                        {day.soup && (

                                            <div className="flex items-center gap-4 rounded-2xl bg-white p-3">

                                                <img
                                                    src={
                                                        day.soup.image
                                                            ? API_URL +
                                                              day.soup.image
                                                            : "https://placehold.co/72"
                                                    }
                                                    className="h-[72px] w-[72px] rounded-2xl object-cover"
                                                />

                                                <div>

                                                    <h3 className="text-lg font-bold">
                                                        {day.soup.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        🥣 Cháo / Súp
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default History;