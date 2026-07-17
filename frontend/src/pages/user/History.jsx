import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipboardList, CalendarDays } from "lucide-react";
import { getHistory } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function History() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const API_URL = import.meta.env.VITE_API_URL;

    const getImageUrl = (image) => {

    if (!image) {

        return "https://placehold.co/600";

    }

    if (image.startsWith("http")) {

        return image;

    }

    return API_URL + image;

};

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
                t("cannot_load_history")
            );
        }
    };

    const formatDay = (date) =>
    new Date(date).toLocaleDateString(
        i18n.language === "ko"
            ? "ko-KR"
            : "vi-VN",
        {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
        }
    );

    const DishCard = ({ dish, type = "", quantity }) => (
        <div className="w-[150px] overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="p-2">

                <img
    src={getImageUrl(dish.image)}
    alt={dish.name}
    className="h-[125px] w-full rounded-[16px] object-cover"
/>

            </div>

            <div className="px-3 pb-4">

                <h3 className="min-h-[42px] text-center text-[16px] font-semibold text-slate-800">
                    {dish.name}
                </h3>

                <div className="mt-2 text-center text-xs font-medium text-gray-500">
                    {type}
                </div>

                {quantity && (
                    <div className="mt-3 flex justify-center">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                            x{quantity}
                        </span>
                    </div>
                )}

            </div>

        </div>
    );

    return (
        <div className="mx-auto max-w-[1080px] px-8 py-8">

            {/* Header */}

            <div className="mb-10 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                    <ClipboardList size={28} />
                </div>

                <h1 className="text-4xl font-bold text-slate-800">
                    {t("history")}
                </h1>

            </div>

            {orders.length === 0 ? (

                <div className="rounded-3xl bg-white py-20 text-center shadow">

                    <ClipboardList
                        size={60}
                        className="mx-auto text-orange-300"
                    />

                    <h2 className="mt-5 text-2xl font-bold text-slate-700">
                        {t("no_order")}
                    </h2>

                </div>

            ) : (

                <div className="space-y-10">

                    {orders.map((order) => (

                        <div
                            key={order._id}
                            className="rounded-[30px] bg-white p-8 shadow"
                        >

                            {/* Week */}

                            {/* Header */}

<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

    <div>

        <h2 className="text-3xl font-bold text-slate-800">
            {order.week}
        </h2>

    </div>

    <div className="flex items-center gap-3">

        <span
            className={`rounded-full px-5 py-2 font-semibold ${
                order.status === "ordered"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {order.status === "ordered"
                ? t("ordered")
                : t("cancelled")}
        </span>

        {order.status === "ordered" && (

            <button

                onClick={() =>
                    navigate(`/order/edit/${order._id}`)
                }

                className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"

            >
                {t("edit")}
            </button>

        )}

    </div>

</div>

                            {/* Days */}

                            <div className="space-y-8">

                                {order.days.map((day) => (

                                    <div
                                        key={day._id || day.date}
                                        className="rounded-[24px] bg-orange-50 p-6"
                                    >

                                        <h3 className="mb-5 text-xl font-bold text-slate-800">
                                            {formatDay(day.date)}
                                        </h3>

                                        <div className="flex flex-wrap gap-5">

                                            {day.mains.map((dish) => (

                                                <DishCard
                                                    key={dish.dishId || dish.name}
                                                    dish={dish}
                                                    quantity={dish.quantity}
                                                    type={t("main_dish")}
                                                />

                                            ))}

                                            {day.drink && (

                                                <DishCard
                                                    dish={day.drink}
                                                    type={`🥤 ${t("drink")}`}
                                                />

                                            )}

                                            {day.soup && (

                                                <DishCard
                                                    dish={day.soup}
                                                    type={`🥣 ${t("soup")}`}
                                                />

                                            )}

                                        </div>

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