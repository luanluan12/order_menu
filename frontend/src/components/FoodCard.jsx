import QuantitySelector from "./QuantitySelector";

const API_URL = "http://localhost:5000";

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

            onClick={handleClick}

            className={`relative overflow-hidden rounded-2xl border bg-white transition-all

            ${disabled

                    ?

                    "cursor-not-allowed opacity-40"

                    :

                    "cursor-pointer hover:-translate-y-1 hover:shadow-xl"

                }

            ${selected

                    ?

                    "border-blue-600 ring-2 ring-blue-500"

                    :

                    "border-gray-200"

                }`}

        >

            {/* Tick */}

            {

                selected && (

                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow">

                        ✓

                    </div>

                )

            }

            {/* Image */}

            <img

                src={

                    food.image

                        ?

                        API_URL + food.image

                        :

                        "https://placehold.co/600x400?text=No+Image"

                }

                alt={food.name}

                className="h-52 w-full object-cover"

            />

            {/* Content */}

            <div className="p-4">

                <h3 className="text-lg font-bold">

                    {food.name}

                </h3>

                {

                    type === "main"

                        ?

                        (

                            <div className="mt-5">

                                <QuantitySelector

                                    quantity={quantity}

                                    disabled={disabled}

                                    onChange={(value) =>

                                        onQuantityChange(

                                            food,

                                            value

                                        )

                                    }

                                />

                            </div>

                        )

                        :

                        (

                            <button

                                disabled={disabled}

                                onClick={(e) => {

                                    e.stopPropagation();

                                    handleClick();

                                }}

                                className={`mt-5 w-full rounded-xl py-3 font-bold transition

                                ${selected

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-gray-100 hover:bg-blue-100"

                                    }`}

                            >

                                {

                                    selected

                                        ?

                                        "Đã chọn"

                                        :

                                        "Chọn"

                                }

                            </button>

                        )

                }

            </div>

        </div>

    );

}

export default FoodCard;