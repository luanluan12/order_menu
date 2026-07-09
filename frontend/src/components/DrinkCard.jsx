import { Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function DrinkCard({
    food,
    checked,
    disabled,
    onSelect,
}) {
    return (
        <div
            className={`
                relative
                flex
                items-center
                gap-6
                w-[460px]
                rounded-3xl
                border-2
                bg-white
                p-4
                transition-all
                duration-300

                ${
                    checked
                        ? "border-orange-500 shadow-lg"
                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                }

                ${
                    disabled
                        ? "opacity-50"
                        : ""
                }
            `}
        >
            {/* Check */}

            {checked && (
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-orange-500 shadow-md">
                    <Check
                        size={20}
                        className="text-white"
                    />
                </div>
            )}

            {/* Image */}

            <img
                src={
                    food.image
                        ? API_URL + food.image
                        : "https://placehold.co/300"
                }
                alt={food.name}
                className="h-40 w-40 rounded-2xl object-cover"
            />

            {/* Content */}

            <div className="flex flex-1 flex-col justify-center">

                <h3 className="text-[20px] font-semibold text-slate-800">
                    {food.name}
                </h3>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(food)}
                    className={`
                        mt-6
                        w-fit
                        rounded-full
                        px-6
                        py-2.5
                        text-[15px]
                        font-semibold
                        transition-all

                        ${
                            checked
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }

                        ${
                            disabled
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                        }
                    `}
                >
                    {checked ? "✓ Đã chọn" : "Chọn món"}
                </button>

            </div>
        </div>
    );
}

export default DrinkCard;