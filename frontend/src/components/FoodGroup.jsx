import {
    UtensilsCrossed,
    CupSoda,
    Soup,
    CakeSlice,
    ChefHat
} from "lucide-react";

import FoodCard from "./FoodCard";

function FoodGroup({

    title,
    subtitle,
    foods,
    type,
    disabled,
    quantityOf,
    selected,
    onQuantityChange,
    onSelect

}) {

    const getIcon = () => {

        switch (type) {

            case "main":
                return <UtensilsCrossed size={22} />;

            case "drink":
                return <CupSoda size={22} />;

            case "soup":
                return <Soup size={22} />;

            case "dessert":
                return <CakeSlice size={22} />;

            default:
                return <ChefHat size={22} />;

        }

    };

    return (

        <div className="flex flex-col items-center gap-6">

            {/* Header */}

            <div className="flex w-full max-w-[500px] items-center gap-4">

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-100
                        text-violet-600
                        shrink-0
                    "
                >

                    {getIcon()}

                </div>

                <div>

                    <h2 className="text-3xl font-bold">

                        {title}

                    </h2>

                    {

                        subtitle && (

                            <p className="mt-1 text-gray-500">

                                {subtitle}

                            </p>

                        )

                    }

                </div>

            </div>

            {

                foods.length === 0 ?

                (

                    <div
                        className="
                            flex
                            h-48
                            w-full
                            max-w-[500px]
                            flex-col
                            items-center
                            justify-center
                            rounded-3xl
                            border-2
                            border-dashed
                            border-gray-200
                            bg-gray-50
                        "
                    >

                        <ChefHat
                            size={46}
                            className="mb-4 text-violet-300"
                        />

                        <h3 className="text-2xl font-semibold text-gray-700">

                            Chưa có món

                        </h3>

                        <p className="mt-2 text-gray-400">

                            Vui lòng chờ quản trị viên cập nhật.

                        </p>

                    </div>

                )

                :

                (

                    <div className="flex w-full max-w-[500px] flex-col gap-4">

                        {

                            foods.map((food) => (

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

                                        type === "drink"

                                            ? selected(food._id)

                                            : type === "soup"

                                                ? selected(food._id)

                                                : false

                                    }

                                    onQuantityChange={

                                        onQuantityChange

                                    }

                                    onSelect={

                                        onSelect

                                    }

                                />

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default FoodGroup;