import DishCard from "./DishCard";

function MainSection({

    mains,

    onSelect,

    onAdd

}) {

    return (

        <div>

            {/* Header */}

            <div className="mb-6">

                <h2 className="text-2xl font-bold">

                    Món chính

                </h2>

                <p className="mt-2 text-gray-500">

                    Tối đa 5 món

                </p>

            </div>

            {/* Cards */}

            <div className="flex flex-wrap gap-6">

                {

                    mains.map((dish, index) => (

                        <DishCard

                            key={index}

                            dish={dish}

                            onClick={() =>

                                onSelect(index)

                            }

                        />

                    ))

                }

                {

                    mains.length < 5 && (

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

        </div>

    );

}

export default MainSection;