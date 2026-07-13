import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DayTabs from "./DayTabs";
import FoodGroup from "./FoodGroup";
import OrderNotice from "./OrderNotice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import bgFood from "../assets/bgfood.png";

function WeekMenuContent({
    menu,
    initialOrder = null,
    onSubmit,
    submitText = "submit_order",
    editable = true,
}) {
    const [currentDay, setCurrentDay] = useState(0);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { t, i18n} = useTranslation();

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
            toast.warning(
                t("warning_other_group")
            );
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
                toast.warning(

                t("warning_max_main")

            );
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
                    toast.warning(

                    t("warning_max_main")

                );
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
            toast.warning(

            t("warning_other_group")

        );
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
            toast.warning(

            t("warning_other_group")

        );
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

    const formatDateTime = (date) => {

    if (!date) return "";

    const locale =

        i18n.language === "ko"

            ? "ko-KR"

            : "vi-VN";

    return new Date(date).toLocaleString(locale);

};

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

    const getUnselectedDays = () => {

    const dayKeys = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday"
    ];

    return orders
        .map((order, index) => {

            const hasMain = order.mains.length > 0;
            const hasDrink = !!order.drink;
            const hasSoup = !!order.soup;

            if (hasMain || hasDrink || hasSoup) {
                return null;
            }

            return t(dayKeys[index]);

        })
        .filter(Boolean);

};
    // Submit
    // =========================
    const handleSubmit = async () => {

    if (!editable) return;

    if (!onSubmit) return;
    const unselectedDays = getUnselectedDays();

if (unselectedDays.length > 0) {

    const result = await Swal.fire({

        icon: "warning",

        title: t("confirm_order_title"),

        html: `
            <div style="text-align:left">

                <p>${t("confirm_order_content")}</p>

                <ul style="margin-top:10px">

                    ${unselectedDays
                        .map(day => `<li style="margin:6px 0">• ${day}</li>`)
                        .join("")}

                </ul>

                <p style="margin-top:16px;color:#dc2626">

                    ${t("confirm_order_warning")}

                </p>

            </div>
        `,

        showCancelButton: true,

        confirmButtonText: t("confirm_order"),

        cancelButtonText: t("go_back"),

        confirmButtonColor: "#f97316",

        cancelButtonColor: "#6b7280",

        reverseButtons: true

    });

    if (!result.isConfirmed) {

        return;

    }

}

    // Validate
    for (const day of orders) {

        const hasMain = day.mains.length > 0;

        const hasDrink = !!day.drink;

        const hasSoup = !!day.soup;

        // Không chọn gì => nghỉ ăn
        if (!hasMain && !hasDrink && !hasSoup) {
            continue;
        }

        const groupCount =
            Number(hasMain) +
            Number(hasDrink) +
            Number(hasSoup);

        if (groupCount > 1) {

            toast.warning(
                "Mỗi ngày chỉ được chọn 1 nhóm món."
            );

            return;

        }

    }

    const success = await onSubmit(orders);

    if (!success) return;

    await Swal.fire({
        icon: "success",
        title: `🎉 ${t("order_success_title")}`,
        text: t("order_success_message"),
        confirmButtonText: t("view_history"),
        confirmButtonColor: "#f97316",
        allowOutsideClick: false,
    });

    navigate("/history");

};

    if (!menu) {
        return (
            <div className="flex h-screen items-center justify-center">
                {t("no_menu")}
            </div>
        );
    }

    // const expired = new Date() > new Date(menu.deadline);
    const expired = false;

    return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">

        {expired && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center sm:p-5">
                <h2 className="text-lg font-bold text-red-600 sm:text-xl">
                    ⛔ {t("order_closed")}
                </h2>

                <p className="mt-2 text-gray-600">
                    {t("deadline")}: {formatDateTime(menu.deadline)}
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

        {/* Món cơm */}

        <FoodGroup
            title={t("main_dish")}

            subtitle={t("max_2_portions")}

            foods={day.mains || []}

            type="main"

            disabled={expired || disableMain()}

            quantityOf={getMainQuantity}

            onQuantityChange={changeMainQuantity}
        />

        {/* Món nước */}

        <div className="mt-10">
            <FoodGroup
                title={t("drink")}

                subtitle={t("choose_1")}

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
                title={t("soup")}

                subtitle={t("choose_1")}

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
                    title={t("dessert")}

                        subtitle={t("free_gift")}

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
    {expired ? t("expired") : t(submitText)}
</button>
        </div>

    </div>
);
}

export default WeekMenuContent;
