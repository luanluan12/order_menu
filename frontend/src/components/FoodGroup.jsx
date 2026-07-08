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

    return (

        <div>

            <div className="mb-5 flex items-end justify-between">

                <div>

                    <h2 className="text-2xl font-bold">

                        {title}

                    </h2>

                    {

                        subtitle && (

                            <p className="mt-1 text-sm text-gray-500">

                                {subtitle}

                            </p>

                        )

                    }

                </div>

            </div>

            {

                foods.length === 0 ?

                    (

                        <div className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-gray-400">

                            Chưa có món.

                        </div>

                    )

                    :

                    (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {

                                foods.map(food => (

                                    <FoodCard

                                        key={food._id}

                                        food={food}

                                        type={type}

                                        disabled={disabled}

                                        quantity={

                                            type === "main"

                                                ?

                                                quantityOf(

                                                    food._id

                                                )

                                                :

                                                0

                                        }

                                        checked={

                                            type === "drink"

                                                ?

                                                selected(

                                                    food._id

                                                )

                                                :

                                                type === "soup"

                                                    ?

                                                    selected(

                                                        food._id

                                                    )

                                                    :

                                                    false

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