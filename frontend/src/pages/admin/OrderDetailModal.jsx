const API_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function OrderDetailModal({

    open,

    order,

    onClose

}) {

    if (!open || !order) return null;

    const image = (path) =>

        path
            ? API_URL + path
            : "https://placehold.co/60x60?text=Food";

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="max-h-[90vh] w-[900px] overflow-y-auto rounded-3xl bg-white p-8">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-3xl font-bold">

                            Đơn đặt món

                        </h2>

                        <p className="mt-2 text-gray-500">

                            {order.user?.name} - {order.week}

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="text-3xl"

                    >

                        ✕

                    </button>

                </div>

                {

                    order.days.map((day, index) => (

                        <div

                            key={index}

                            className="mb-8 rounded-2xl border p-6"

                        >

                            <h3 className="mb-5 text-xl font-bold">

                                {new Date(day.date).toLocaleDateString("vi-VN", {

                                    weekday: "long",

                                    day: "2-digit",

                                    month: "2-digit"

                                })}

                            </h3>

                            {/* Main */}

                            {

                                day.mains.length > 0 && (

                                    <div className="mb-5">

                                        <div className="mb-3 font-semibold">

                                            🍱 Món chính

                                        </div>

                                        {

                                            day.mains.map((dish, i) => (

                                                <div

                                                    key={i}

                                                    className="mb-3 flex items-center gap-4"

                                                >

                                                    <img

                                                        src={image(dish.image)}

                                                        className="h-14 w-14 rounded-full object-cover"

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

                                    </div>

                                )

                            }

                            {/* Drink */}

                            {

                                day.drink && (

                                    <div className="mb-5 flex items-center gap-4">

                                        <img

                                            src={image(day.drink.image)}

                                            className="h-14 w-14 rounded-full object-cover"

                                        />

                                        <div>

                                            🥤 {day.drink.name}

                                        </div>

                                    </div>

                                )

                            }

                            {/* Soup */}

                            {

                                day.soup && (

                                    <div className="flex items-center gap-4">

                                        <img

                                            src={image(day.soup.image)}

                                            className="h-14 w-14 rounded-full object-cover"

                                        />

                                        <div>

                                            🥣 {day.soup.name}

                                        </div>

                                    </div>

                                )

                            }

                        </div>

                    ))

                }

                <div className="mt-8 flex justify-end">

                    <button

                        onClick={onClose}

                        className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white"

                    >

                        Đóng

                    </button>

                </div>

            </div>

        </div>

    );

}

export default OrderDetailModal;