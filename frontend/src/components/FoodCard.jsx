import { Check, Plus } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

const API_URL = import.meta.env.VITE_API_URL;

function FoodCard({

    food,
    type,
    disabled,
    quantity,
    checked,
    onQuantityChange,
    onSelect

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

            onClick={

                type !== "main"

                    ? handleClick

                    : undefined

            }

            className={`
                flex
        items-center
        justify-between

        w-full
        max-w-[500px]

        rounded-3xl
        border
        bg-white

        px-6
        py-4

        transition
        duration-200

                ${
                    disabled

                        ? "cursor-not-allowed opacity-50"

                        : "hover:shadow-lg"
                }

                ${
                    selected && type !== "main"

                        ? "border-violet-500 bg-violet-50"

                        : "border-gray-200"
                }
            `}
        >

            {/* LEFT */}

            <div className="flex items-center gap-4">

                <img

                    src={

                        food.image

                            ? API_URL + food.image

                            : "https://placehold.co/120"

                    }

                    alt={food.name}

                    className="
                        h-16
                        w-16
                        rounded-full
                        object-cover
                        border
                        border-gray-200
                        shrink-0
                    "

                />

                <div>

                    <h3 className="text-lg font-semibold text-gray-900">

                        {food.name}

                    </h3>

                </div>

            </div>

            {/* RIGHT */}

            {

                type === "main"

                    ?

                    (

                        <QuantitySelector

                            quantity={quantity}

                            disabled={disabled}

                            onChange={(value)=>

                                onQuantityChange(

                                    food,

                                    value

                                )

                            }

                        />

                    )

                    :

                    (

                        <button

                            disabled={disabled}

                            onClick={(e)=>{

                                e.stopPropagation();

                                handleClick();

                            }}

                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                transition

                                ${
                                    selected

                                        ? "bg-violet-600 text-white"

                                        : "border border-gray-300 bg-white hover:border-violet-500 hover:bg-violet-50"
                                }
                            `}

                        >

                            {

                                selected

                                    ? <Check size={18} />

                                    : <Plus size={18} />

                            }

                        </button>

                    )

            }

        </div>

    );

}

export default FoodCard;