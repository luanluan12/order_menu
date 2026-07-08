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

    return (

        <div className="mx-auto max-w-7xl p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold">

                    Thực đơn tuần {menu.week}

                </h1>

                <p className="mt-2 text-gray-500">

                    Chọn món cho từng ngày

                </p>

            </div>

            <DayTabs

                days={menu.days}

                currentDay={currentDay}

                onChange={setCurrentDay}

            />

            <div className="mt-8 space-y-10">

                {/* ================= MAIN ================= */}

                <FoodGroup

                    title="🍱 Món chính"

                    subtitle="Chọn tối đa 2 phần"

                    foods={day.mains || []}

                    type="main"

                    disabled={disableMain()}

                    quantityOf={getMainQuantity}

                    onQuantityChange={changeMainQuantity}

                />

                {/* ================= DRINK ================= */}

                <FoodGroup

                    title="🥤 Nước"

                    subtitle="Chọn 1"

                    foods={day.drinks || []}

                    type="drink"

                    disabled={disableDrink()}

                    selected={isDrinkSelected}

                    onSelect={toggleDrink}

                />

                {/* ================= SOUP ================= */}

                <FoodGroup

                    title="🥣 Cháo / Súp"

                    subtitle="Chọn 1"

                    foods={day.soups || []}

                    type="soup"

                    disabled={disableSoup()}

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

            {

                editable && (

                    <div className="mt-12 flex justify-end">

                        <button

                            onClick={handleSubmit}

                            className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white transition hover:bg-blue-700"

                        >

                            {submitText}

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default WeekMenuContent;