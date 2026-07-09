import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DayTabs from "./DayTabs";
import FoodGroup from "./FoodGroup";
import OrderNotice from "./OrderNotice";

function WeekMenuContent({
    menu,
    initialOrder = null,
    onSubmit,
    submitText = "ĐẶT MÓN",
    editable = true,
}) {
    const [currentDay, setCurrentDay] = useState(0);
    const [orders, setOrders] = useState([]);

    // =========================
    // Init Order
    // =========================

    useEffect(() => {
        if (!menu) return;

        if (initialOrder?.days) {
            setOrders(initialOrder.days);
            return;
        }

        setOrders(
            menu.days.map((day) => ({
                date: day.date,
                mains: [],
                drink: null,
                soup: null,
            }))
        );
    }, [menu, initialOrder]);

    if (!menu) return null;

    const day = menu.days[currentDay];

    // =========================
    // MAIN
    // =========================

    const changeMainQuantity = (dish, quantity) => {
        if (!editable) return;

        const clone = [...orders];
        const current = { ...clone[currentDay] };

        if (current.drink || current.soup) {
            toast.warning("Đã chọn nhóm khác.");
            return;
        }

        let mains = [...current.mains];

        const index = mains.findIndex(
            (item) => String(item.dishId) === String(dish._id)
        );

        if (index === -1) {
            if (quantity <= 0) return;

            const total = mains.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            if (total + quantity > 2) {
                toast.warning("Chỉ được chọn tối đa 2 phần.");
                return;
            }

            mains.push({
                dishId: dish._id,
                name: dish.name,
                image: dish.image,
                quantity,
            });
        } else {
            const totalWithoutCurrent = mains.reduce(
                (sum, item, i) =>
                    i === index ? sum : sum + item.quantity,
                0
            );

            if (quantity <= 0) {
                mains.splice(index, 1);
            } else {
                if (totalWithoutCurrent + quantity > 2) {
                    toast.warning("Chỉ được chọn tối đa 2 phần.");
                    return;
                }

                mains[index] = {
                    ...mains[index],
                    quantity,
                };
            }
        }

        current.mains = mains;
        clone[currentDay] = current;
        setOrders(clone);
    };

    // =========================
    // DRINK
    // =========================

    const toggleDrink = (dish) => {
        if (!editable) return;

        const clone = [...orders];
        const current = { ...clone[currentDay] };

        if (current.mains.length > 0 || current.soup) {
            toast.warning("Đã chọn nhóm khác.");
            return;
        }

        if (
            current.drink &&
            String(current.drink.dishId) === String(dish._id)
        ) {
            current.drink = null;
        } else {
            current.drink = {
                dishId: dish._id,
                name: dish.name,
                image: dish.image,
            };
        }

        clone[currentDay] = current;
        setOrders(clone);
    };

    // =========================
    // SOUP
    // =========================

    const toggleSoup = (dish) => {
        if (!editable) return;

        const clone = [...orders];
        const current = { ...clone[currentDay] };

        if (current.mains.length > 0 || current.drink) {
            toast.warning("Đã chọn nhóm khác.");
            return;
        }

        if (
            current.soup &&
            String(current.soup.dishId) === String(dish._id)
        ) {
            current.soup = null;
        } else {
            current.soup = {
                dishId: dish._id,
                name: dish.name,
                image: dish.image,
            };
        }

        clone[currentDay] = current;
        setOrders(clone);
    };

    // =========================
    // Helpers
    // =========================

    const getMainQuantity = (dishId) => {
        const item = orders[currentDay]?.mains.find(
            (m) => String(m.dishId) === String(dishId)
        );

        return item ? item.quantity : 0;
    };

    const isDrinkSelected = (dishId) =>
        String(orders[currentDay]?.drink?.dishId || "") ===
        String(dishId);

    const isSoupSelected = (dishId) =>
        String(orders[currentDay]?.soup?.dishId || "") ===
        String(dishId);

    const disableMain = () =>
        !!orders[currentDay]?.drink ||
        !!orders[currentDay]?.soup;

    const disableDrink = () =>
        orders[currentDay]?.mains.length > 0 ||
        !!orders[currentDay]?.soup;

    const disableSoup = () =>
        orders[currentDay]?.mains.length > 0 ||
        !!orders[currentDay]?.drink;
            // =========================
    // Submit
    // =========================

    const handleSubmit = () => {
        if (!editable) return;
        if (!onSubmit) return;

        onSubmit(orders);
    };

    if (!menu) {
        return (
            <div className="flex h-screen items-center justify-center">
                Chưa có thực đơn.
            </div>
        );
    }

    const expired = new Date() > new Date(menu.deadline);

    return (
    <div className="mx-auto w-full max-w-[1080px] px-10 py-8">

        {expired && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <h2 className="text-xl font-bold text-red-600">
                    ⛔ Đã hết thời gian đặt món
                </h2>

                <p className="mt-2 text-gray-600">
                    Hạn chót{" "}
                    {new Date(menu.deadline).toLocaleString("vi-VN")}
                </p>
            </div>
        )}

        {/* Tabs */}

        <div className="mb-10">
            <DayTabs
                days={menu.days}
                currentDay={currentDay}
                onChange={setCurrentDay}
            />
        </div>
        <div className="mb-10">
    <OrderNotice />
</div>

        {/* Món chính */}

        <FoodGroup
            title="Món chính"
            subtitle="Chọn tối đa 2 phần"
            foods={day.mains || []}
            type="main"
            disabled={expired || disableMain()}
            quantityOf={getMainQuantity}
            onQuantityChange={changeMainQuantity}
        />

        {/* Món nước */}

        <div className="mt-10">
            <FoodGroup
                title="Món nước"
                subtitle="Chọn 1 món"
                foods={day.drinks || []}
                type="drink"
                disabled={expired || disableDrink()}
                selected={isDrinkSelected}
                onSelect={toggleDrink}
            />
        </div>

        {/* Cháo */}

        <div className="mt-10">
            <FoodGroup
                title="Cháo / Súp"
                subtitle="Chọn 1 món"
                foods={day.soups || []}
                type="soup"
                disabled={expired || disableSoup()}
                selected={isSoupSelected}
                onSelect={toggleSoup}
            />
        </div>

        {/* Tráng miệng */}

        {day.desserts?.length > 0 && (
            <div className="mt-10">
                <FoodGroup
                    title="Tráng miệng"
                    subtitle="Món tặng kèm"
                    foods={day.desserts}
                    type="dessert"
                    disabled
                />
            </div>
        )}

        <div className="mt-14 flex justify-center">
            <button
    onClick={handleSubmit}
    disabled={expired}
    className={`
        rounded-2xl
        px-14
        py-4
        text-lg
        font-bold
        text-white
        shadow-lg
        transition-all
        duration-300

        ${
            expired
                ? "cursor-not-allowed bg-gray-400"
                : "bg-orange-500 hover:bg-orange-600 hover:shadow-xl active:scale-95"
        }
    `}
>
    {expired ? "ĐÃ HẾT HẠN" : submitText}
</button>
        </div>

    </div>
);
}

export default WeekMenuContent;
