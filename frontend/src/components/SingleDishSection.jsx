import DishCard from "./DishCard";

function SingleDishSection({

    title,

    dish,

    onSelect,

    onAdd

}) {

    const hasDish =

        dish?.name ||

        dish?.image;

    return (

        <div>

            {/* Header */}

            <div className="mb-6">

                <h2 className="text-2xl font-bold">

                    {title}

                </h2>

            </div>

            {/* Card */}

            {

                hasDish ? (

                    <DishCard

                        dish={dish}

                        onClick={onSelect}

                    />

                ) : (

                    <button

                        type="button"

                        onClick={onAdd}

                        className="flex h-[210px] w-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-violet-500 hover:bg-violet-50"

                    >

                        <div className="text-5xl text-violet-600">

                            +

                        </div>

                        <p className="mt-4 text-lg font-semibold text-gray-600">

                            Thêm món

                        </p>

                    </button>

                )

            }

        </div>

    );

}

export default SingleDishSection;