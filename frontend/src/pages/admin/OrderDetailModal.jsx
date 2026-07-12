const API_URL = import.meta.env.VITE_API_URL;

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

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6">

            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-4 sm:rounded-3xl sm:p-8">

                {/* Header */}

                <div className="mb-6 flex items-start justify-between">

                    <div>

                        <h2 className="text-2xl font-bold sm:text-3xl">

                            Đơn đặt món

                        </h2>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">

                            {order.user?.name} - {order.week}

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="text-2xl font-bold text-gray-500 hover:text-black"

                    >

                        ✕

                    </button>

                </div>

                {

                    order.days.map((day, index) => (

                        <div

                            key={index}

                            className="mb-5 rounded-2xl border p-4 sm:mb-8 sm:p-6"

                        >

                            <h3 className="mb-4 text-lg font-bold capitalize sm:text-xl">

                                {

                                    new Date(day.date).toLocaleDateString(

                                        "vi-VN",

                                        {

                                            weekday: "long",

                                            day: "2-digit",

                                            month: "2-digit"

                                        }

                                    )

                                }

                            </h3>

                            {/* Main */}

                            {

                                day.mains.length > 0 && (

                                    <div className="mb-5">

                                        <div className="mb-3 font-semibold">

                                            🍱 Món cơm

                                        </div>

                                        {

                                            day.mains.map((dish, i) => (

                                                <div

                                                    key={i}

                                                    className="mb-3 flex items-center gap-3"

                                                >

                                                    <img

                                                        src={image(dish.image)}

                                                        className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"

                                                    />

                                                    <div className="flex-1 text-sm sm:text-base">

                                                        {dish.name}

                                                    </div>

                                                    <div className="font-semibold">

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

                                    <div className="mb-4 flex items-center gap-3">

                                        <img

                                            src={image(day.drink.image)}

                                            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"

                                        />

                                        <div className="text-sm sm:text-base">

                                            🥤 {day.drink.name}

                                        </div>

                                    </div>

                                )

                            }

                            {/* Soup */}

                            {

                                day.soup && (

                                    <div className="flex items-center gap-3">

                                        <img

                                            src={image(day.soup.image)}

                                            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"

                                        />

                                        <div className="text-sm sm:text-base">

                                            🥣 {day.soup.name}

                                        </div>

                                    </div>

                                )

                            }

                        </div>

                    ))

                }

                <div className="mt-6 flex justify-center sm:justify-end">

                    <button

                        onClick={onClose}

                        className="w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 sm:w-auto"

                    >

                        Đóng

                    </button>

                </div>

            </div>

        </div>

    );

}

export default OrderDetailModal;