import { Check } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

const API_URL = import.meta.env.VITE_API_URL;

function FoodCard({
    food,
    type,
    disabled,
    quantity,
    checked,
    onQuantityChange,
    onSelect,
}) {
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
            w-[170px]
            rounded-[22px]
            border-2
            bg-white
            overflow-hidden
            transition-all
            duration-300
            cursor-pointer

            ${
                selected
                    ? "border-orange-500 shadow-lg"
                    : "border-gray-200 hover:border-orange-300 hover:shadow-md"
            }

            ${
                disabled
                    ? "opacity-50 pointer-events-none"
                    : ""
            }
        `}
    >
        {/* Tick */}

        {selected && (
            <div className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow-md">
                <Check size={20} className="text-white" />
            </div>
        )}

        {/* Image */}

        <div className="p-2 pb-0">
            <img
                src={
                    food.image
                        ? API_URL + food.image
                        : "https://placehold.co/600"
                }
                alt={food.name}
                className="
                    h-[155px]
                    w-full
                    rounded-[18px]
                    object-cover
                "
            />
        </div>

        {/* Body */}

        <div className="px-3 pt-3 pb-4">

            <h3 className="text-center text-[20px] font-medium text-gray-800 leading-6 min-h-[48px] flex items-center justify-center">
                {food.name}
            </h3>

            <div className="mt-3">

                {type === "main" ? (

                    <QuantitySelector
                        quantity={quantity}
                        disabled={disabled}
                        onChange={(value) =>
                            onQuantityChange(food, value)
                        }
                    />

                ) : (

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        className={`
                            h-11
                            w-full
                            rounded-full
                            font-semibold
                            text-[17px]
                            transition

                            ${
                                selected
                                    ? "bg-orange-100 text-green-600"
                                    : "border border-gray-300 bg-white text-gray-600 hover:bg-orange-100"
                            }
                        `}
                    >
                        {selected ? "✓ Đã chọn" : "Chọn món"}
                    </button>

                )}

            </div>

        </div>

    </div>
);
}

export default FoodCard;