function DishCard({

    dish,

    onClick,

    selected = false

}) {

    const imageUrl =

        dish?.image instanceof File

            ? URL.createObjectURL(dish.image)

            : dish?.image || null;

    return (

        <button

            type="button"

            onClick={onClick}

            className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg

            ${

                selected

                    ?

                    "border-violet-600 ring-2 ring-violet-200"

                    :

                    "border-gray-200"

            }`}

        >

            {/* Image */}

            <div className="flex h-36 w-44 items-center justify-center overflow-hidden bg-gray-100">

                {

                    imageUrl

                        ?

                        <img

                            src={imageUrl}

                            alt={dish.name}

                            className="h-full w-full object-cover transition group-hover:scale-105"

                        />

                        :

                        <div className="text-center">

                            <div className="text-5xl">

                                📷

                            </div>

                            <p className="mt-2 text-xs text-gray-400">

                                Chưa có ảnh

                            </p>

                        </div>

                }

            </div>

            {/* Name */}

            <div className="border-t bg-white px-4 py-3">

                <p className="truncate text-center text-sm font-semibold text-gray-700">

                    {

                        dish?.name

                            ?

                            dish.name

                            :

                            "Chưa có tên"

                    }

                </p>

            </div>

        </button>

    );

}

export default DishCard;