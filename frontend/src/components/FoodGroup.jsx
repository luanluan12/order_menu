import {
    UtensilsCrossed,
    CupSoda,
    Soup,
    CakeSlice,
    ChefHat,
} from "lucide-react";

import FoodCard from "./FoodCard";
import DrinkCard from "./DrinkCard";
import { useTranslation } from "react-i18next";

function FoodGroup({
    title,
    subtitle,
    foods,
    type,
    disabled,
    quantityOf,
    selected,
    onQuantityChange,
    onSelect,
    selectedText,
}) {
    const { t } = useTranslation();
    const getIcon = () => {
        switch (type) {
            case "main":
                return <UtensilsCrossed size={20} />;

            case "drink":
                return <CupSoda size={20} />;

            case "soup":
                return <Soup size={20} />;

            case "dessert":
                return <CakeSlice size={20} />;

            default:
                return <ChefHat size={20} />;
        }
    };

    const getHeaderColor = () => {
        switch (type) {
            case "main":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-500",
                    selected: "text-orange-500",
                };

            case "drink":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-500",
                    selected: "text-orange-500",
                };

            case "soup":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-500",
                    selected: "text-orange-500",
                };

            default:
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-500",
                    selected: "text-orange-500",
                };
        }
    };

    const color = getHeaderColor();

    const useDrinkCard =
        type === "drink" || type === "soup";

    return (
        <section className="w-full">
            {/* Header */}

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-3 sm:items-center sm:gap-4">

                    <div
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${color.bg} ${color.text}`}
>
                        {getIcon()}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">

                        <h2 className="text-base font-bold uppercase tracking-wide text-slate-800 sm:text-lg">
                            {title}
                        </h2>

                        {subtitle && (
                            <span className="text-sm text-slate-500">
                                ({subtitle})
                            </span>
                        )}

                    </div>

                </div>

                {selectedText && (
                    <div className="text-sm font-semibold sm:text-base">
                        <span className={color.selected}>
                            {t("selected")}:
                        </span>

                        <span className="text-slate-700">
                            {" "}
                            {selectedText}
                        </span>
                    </div>
                )}

            </div>

            {/* Empty */}

            {foods.length === 0 ? (

                <div className="flex h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 sm:h-52">

                    <ChefHat
                        size={46}
                        className="mb-4 text-orange-300"
                    />

                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                        {t("no_dish")}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        {t("wait_admin_update")}
                    </p>

                </div>

            ) : useDrinkCard ? (

                <div className="flex flex-wrap gap-5">

                    {foods.map((food) => (
                        <DrinkCard
                            key={food._id}
                            food={food}
                            checked={selected?.(food._id)}
                            disabled={disabled}
                            onSelect={onSelect}
                        />
                    ))}

                </div>

            ) : (

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-5
                    "
                >

                    {foods.map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            type={type}
                            disabled={disabled}
                            quantity={
                                type === "main"
                                    ? quantityOf(food._id)
                                    : 0
                            }
                            checked={
                                type === "dessert" && selected
                                    ? selected(food._id)
                                    : false
                            }
                            onQuantityChange={onQuantityChange}
                            onSelect={onSelect}
                        />
                    ))}

                </div>

            )}

        </section>
    );
}

export default FoodGroup;