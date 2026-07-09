import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import DayTabs from "./DayTabs";
import FoodGroup from "./FoodGroup";

function WeekMenuContent({

    menu,

    initialOrder = null,

    onSubmit,

    submitText = "ĐẶT MÓN",

    editable = true

}) {

    const [currentDay, setCurrentDay] = useState(0);

    const [orders, setOrders] = useState([]);

    // ==========================
    // Init Order
    // ==========================

    useEffect(() => {

        if (!menu) return;

        // Đã có Order
        if (

            initialOrder &&

            initialOrder.days

        ) {

            setOrders(

                initialOrder.days

            );

            return;

        }

        // Chưa có Order

        setOrders(

            menu.days.map(day => ({

                date: day.date,

                mains: [],

                drink: null,

                soup: null

            }))

        );

    }, [

        menu,

        initialOrder

    ]);

    if (!menu) {

        return null;

    }

    const day =

        menu.days[currentDay];

    // ===================================
    // Main
    // ===================================

    const changeMainQuantity = (dish, quantity) => {

        if (!editable) return;

        const clone = [...orders];

        const current = { ...clone[currentDay] };

        // Đã chọn Drink hoặc Soup thì không được chọn Main
        if (current.drink || current.soup) {

            toast.warning("Đã chọn nhóm khác.");

            return;

        }

        let mains = [...current.mains];

        const index = mains.findIndex(

            item => String(item.dishId) === String(dish._id)

        );

        if (index === -1) {

            if (quantity <= 0) return;

            const total = mains.reduce(

                (sum, item) => sum + item.quantity,

                0

            );

            if (total + quantity > 2) {

                toast.warning(

                    "Chỉ được chọn tối đa 2 phần."

                );

                return;

            }

            mains.push({

                dishId: dish._id,

                name: dish.name,

                image: dish.image,

                quantity

            });

        }

        else {

            const totalWithoutCurrent = mains.reduce(

                (sum, item, i) =>

                    i === index

                        ? sum

                        : sum + item.quantity,

                0

            );

            if (quantity <= 0) {

                mains.splice(index, 1);

            }

            else {

                if (

                    totalWithoutCurrent + quantity > 2

                ) {

                    toast.warning(

                        "Chỉ được chọn tối đa 2 phần."

                    );

                    return;

                }

                mains[index] = {

                    ...mains[index],

                    quantity

                };

            }

        }

        current.mains = mains;

        clone[currentDay] = current;

        setOrders(clone);

    };

    // ===================================
    // Drink
    // ===================================

    const toggleDrink = (dish) => {

        if (!editable) return;

        const clone = [...orders];

        const current = { ...clone[currentDay] };

        if (

            current.mains.length > 0 ||

            current.soup

        ) {

            toast.warning(

                "Đã chọn nhóm khác."

            );

            return;

        }

        if (

            current.drink &&

            String(current.drink.dishId) ===

            String(dish._id)

        ) {

            current.drink = null;

        }

        else {

            current.drink = {

                dishId: dish._id,

                name: dish.name,

                image: dish.image

            };

        }

        clone[currentDay] = current;

        setOrders(clone);

    };

    // ===================================
    // Soup
    // ===================================

    const toggleSoup = (dish) => {

        if (!editable) return;

        const clone = [...orders];

        const current = { ...clone[currentDay] };

        if (

            current.mains.length > 0 ||

            current.drink

        ) {

            toast.warning(

                "Đã chọn nhóm khác."

            );

            return;

        }

        if (

            current.soup &&

            String(current.soup.dishId) ===

            String(dish._id)

        ) {

            current.soup = null;

        }

        else {

            current.soup = {

                dishId: dish._id,

                name: dish.name,

                image: dish.image

            };

        }

        clone[currentDay] = current;

        setOrders(clone);

    };

    // ===================================
    // Helpers
    // ===================================

    const getMainQuantity = (dishId) => {

        const item = orders[currentDay]?.mains.find(

            m => String(m.dishId) === String(dishId)

        );

        return item ? item.quantity : 0;

    };

    const isDrinkSelected = (dishId) => {

        return (

            String(

                orders[currentDay]?.drink?.dishId || ""

            ) === String(dishId)

        );

    };

    const isSoupSelected = (dishId) => {

        return (

            String(

                orders[currentDay]?.soup?.dishId || ""

            ) === String(dishId)

        );

    };

    const disableMain = () => {

        return (

            !!orders[currentDay]?.drink ||

            !!orders[currentDay]?.soup

        );

    };

    const disableDrink = () => {

        return (

            orders[currentDay]?.mains.length > 0 ||

            !!orders[currentDay]?.soup

        );

    };

    const disableSoup = () => {

        return (

            orders[currentDay]?.mains.length > 0 ||

            !!orders[currentDay]?.drink

        );

    };

    // ===================================
    // Submit
    // ===================================

    const handleSubmit = () => {

        if (!editable) {

            return;

        }

        if (!onSubmit) {

            return;

        }

        onSubmit(orders);

    };
    // ===================================
    // Render
    // ===================================

    if (!menu) {

        return (

            <div className="flex h-screen items-center justify-center">

                Chưa có thực đơn.

            </div>

        );

    }
    const expired =

    new Date() >

    new Date(menu.deadline);

    return (

        <div className="mx-auto max-w-7xl p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold">

                    Thực đơn tuần {menu.week}

                </h1>

                {
    expired && (

        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">

            <div className="text-xl font-bold text-red-600">

                ⛔ Đã hết thời gian đặt món

            </div>

            <div className="mt-2 text-gray-600">

                Hạn chót:

                {" "}

                {

                    new Date(menu.deadline).toLocaleString(

                        "vi-VN"

                    )

                }

            </div>

        </div>

    )
}

            </div>


            <div className="mt-8 grid grid-cols-[220px_1fr] gap-8">

    {/* LEFT */}
    <DayTabs
        days={menu.days}
        currentDay={currentDay}
        onChange={setCurrentDay}
    />

    {/* RIGHT */}
    <div className="space-y-10">

        {/* ================= MAIN ================= */}

        <FoodGroup
            title="Món chính"
            subtitle="Chọn tối đa 2 phần"
            foods={day.mains || []}
            type="main"
            disabled={expired || disableMain()}
            quantityOf={getMainQuantity}
            onQuantityChange={changeMainQuantity}
        />

        {/* ================= DRINK ================= */}

        <FoodGroup
            title="Món nước"
            subtitle="Chọn 1"
            foods={day.drinks || []}
            type="drink"
            disabled={expired || disableDrink()}
            selected={isDrinkSelected}
            onSelect={toggleDrink}
        />

        {/* ================= SOUP ================= */}

        <FoodGroup
            title="Cháo / Súp"
            subtitle="Chọn 1"
            foods={day.soups || []}
            type="soup"
            disabled={expired || disableSoup()}
            selected={isSoupSelected}
            onSelect={toggleSoup}
        />

        {/* ================= DESSERT ================= */}

        {
            day.desserts?.length > 0 && (
                <FoodGroup
                    title="🍰 Tráng miệng"
                    subtitle="Chỉ hiển thị"
                    foods={day.desserts}
                    type="dessert"
                    disabled={true}
                />
            )
        }

    </div>

</div>

            {

               <div className="mt-12 flex justify-center">

    <button

        disabled={expired}

        onClick={handleSubmit}

        className={`

            rounded-2xl

            px-16

            py-4

            text-xl

            font-bold

            text-white

            shadow-lg

            transition

            ${

                expired

                ?

                "cursor-not-allowed bg-gray-400"

                :

                "bg-violet-600 hover:bg-violet-700"

            }

        `}

    >

        {

            expired

            ?

            "ĐÃ HẾT HẠN"

            :

            submitText

        }

    </button>

</div>

            }

        </div>

    );

}

export default WeekMenuContent;