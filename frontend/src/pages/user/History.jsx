import { useEffect, useState } from "react";
import { getHistory } from "../../api/orderApi";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5001";

function History() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const res = await getHistory();

            setOrders(res.data.data);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Không tải được lịch sử."

            );

        }

    };

    return (

        <div className="mx-auto max-w-7xl p-8">

            <h1 className="mb-8 text-3xl font-bold">

                📋 Lịch sử đặt món

            </h1>

            {

                orders.length === 0 ?

                (

                    <div className="rounded-2xl bg-white p-12 text-center shadow">

                        Chưa có đơn đặt món.

                    </div>

                )

                :

                (

                    <div className="space-y-8">

                        {

                            orders.map(order => (

                                <div

                                    key={order._id}

                                    className="rounded-2xl bg-white p-8 shadow"

                                >

                                    <div className="mb-6 flex items-center justify-between">

                                        <div>

                                            <h2 className="text-xl font-bold">

                                                Tuần {order.week}

                                            </h2>

                                            <p className="text-gray-500">

                                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}

                                            </p>

                                        </div>

                                        <span className={`rounded-full px-4 py-2 text-sm font-semibold

                                        ${

                                            order.status === "ordered"

                                            ?

                                            "bg-green-100 text-green-700"

                                            :

                                            "bg-red-100 text-red-700"

                                        }`}>

                                            {

                                                order.status === "ordered"

                                                ?

                                                "Đã đặt"

                                                :

                                                "Đã hủy"

                                            }

                                        </span>

                                    </div>

                                    {

                                        order.days.map((day)=>(

                                            <div

                                                key={day._id || day.date}

                                                className="mb-5 rounded-xl border p-5"

                                            >

                                                <div className="mb-3 font-bold">

                                                    {

                                                        new Date(day.date).toLocaleDateString(

                                                            "vi-VN",

                                                            {

                                                                weekday:"long",

                                                                day:"2-digit",

                                                                month:"2-digit"

                                                            }

                                                        )

                                                    }

                                                </div>

                                                {/* Main */}

                                                {

                                                    day.mains.map((dish)=>(

                                                        <div

                                                            key={dish.dishId || dish._id || dish.name}

                                                            className="mb-2 flex items-center gap-3"

                                                        >

                                                            <img

                                                                src={

                                                                    dish.image

                                                                    ?

                                                                    API_URL+dish.image

                                                                    :

                                                                    "https://placehold.co/50"

                                                                }

                                                                className="h-12 w-12 rounded-full object-cover"

                                                            />

                                                            <div className="flex-1">

                                                                {dish.name}

                                                            </div>

                                                            <div>

                                                                x{dish.quantity}

                                                            </div>

                                                        </div>

                                                    ))

                                                }

                                                {

                                                    day.drink && (

                                                        <div className="mt-2">

                                                            🥤 {day.drink.name}

                                                        </div>

                                                    )

                                                }

                                                {

                                                    day.soup && (

                                                        <div>

                                                            🥣 {day.soup.name}

                                                        </div>

                                                    )

                                                }

                                            </div>

                                        ))

                                    }

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default History;