import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import QuantitySelector from "./QuantitySelector";

function FoodCard({
    food,
    type,
    disabled,
    quantity,
    checked,
    onQuantityChange,
    onSelect,
}) {

    const { t, i18n } = useTranslation();


const displayName =
    i18n.language === "ko"
        ? (food.nameKo || food.name)
        : food.name;

    const selected =
        type === "main"
            ? quantity > 0
            : checked;

    const handleClick = () => {

        if (disabled) return;

        if (type === "main") return;

        onSelect(food);

    };

    return (

        <div

            onClick={type !== "main" ? handleClick : undefined}

            className={`
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border-2
                bg-white
                transition-all
                duration-300

                ${
                    type !== "main"
                        ? "cursor-pointer"
                        : ""
                }

                ${
                    selected
                        ? "border-orange-500 shadow-lg"
                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                }

                ${
                    disabled
                        ? "pointer-events-none opacity-50"
                        : ""
                }
            `}
        >

            {/* Tick */}

            {

                selected && (

                    <div className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow sm:h-9 sm:w-9">

                        <Check

                            size={18}

                            className="text-white"

                        />

                    </div>

                )

            }
            {
    food.vegetarian && (

        <div className="absolute left-2 top-2 z-20 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">

            🌱 {t("vegetarian")}

        </div>

    )
}

            {/* Image */}

            <div className="p-2 pb-0">

                <img

                    src={
    food.image
        ? food.image
        : "https://placehold.co/600"
}

                    alt={displayName}

                    className="
                        h-28
                        w-full
                        rounded-xl
                        object-cover

                        sm:h-36
                        lg:h-[155px]
                    "

                />

            </div>

            {/* Body */}

            <div className="px-3 pb-4 pt-3">

                <div className="min-h-[56px]">

    <h3
        className="
             text-center
            text-sm
            font-semibold
            leading-5
            text-gray-800
            break-words
            whitespace-normal

            sm:text-lg
        "
    >

        {displayName}

    </h3>

    {

        food.subtitle && (

            <p
                className="
                    mt-1
                text-center
                text-xs
                text-gray-500
                break-words
                whitespace-normal

                sm:text-sm
                "
            >

                {food.subtitle}

            </p>

        )

    }

</div>

                <div className="mt-3">

                    {

                        type === "main"

                            ? (

                                <QuantitySelector

                                    quantity={quantity}

                                    disabled={disabled}

                                    onChange={(value) =>

                                        onQuantityChange(food, value)

                                    }

                                />

                            )

                            : (

                                <button

                                    onClick={(e) => {

                                        e.stopPropagation();

                                        handleClick();

                                    }}

                                    className={`
                                        h-10
                                        w-full
                                        rounded-full
                                        text-sm
                                        font-semibold
                                        transition

                                        sm:h-11
                                        sm:text-base

                                        ${
                                            selected
                                                ? "bg-orange-100 text-green-600"
                                                : "border border-gray-300 bg-white text-gray-600 hover:bg-orange-100"
                                        }
                                    `}

                                >

                                    {

                                        selected

                                            ? `✓ ${t("selected")}`

                                            : t("select_dish")

                                    }

                                </button>

                            )

                    }

                </div>

            </div>

        </div>

    );

}

export default FoodCard;