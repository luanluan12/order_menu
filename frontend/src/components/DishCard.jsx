const API_URL = import.meta.env.VITE_API_URL;

function DishCard({
    dish,
    onClick,
    selected = false,
}) {

    const imageUrl =
    dish?.image instanceof File
        ? URL.createObjectURL(dish.image)
        : dish?.image
            ? `${API_URL}${dish.image}`
            : null;

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                relative
                w-full
                max-w-[150px]
                overflow-hidden
                rounded-2xl
                border-2
                bg-white
                transition-all
                duration-300

                ${
                    selected
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                }
            `}
        >

            {/* Image */}

            <div className="p-2 pb-0">

                {

                    imageUrl ? (

                        <img
                            src={imageUrl}
                            alt={dish?.name}
                            className="
                                h-28
                                w-full
                                rounded-xl
                                object-cover
                                sm:h-32
                            "
                        />

                    ) : (

                        <div
                            className="
                                flex
                                h-28
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-100
                                sm:h-32
                            "
                        >

                            <div className="text-center">

                                <div className="text-3xl sm:text-4xl">
                                    📷
                                </div>

                                <p className="mt-1 text-[10px] text-gray-400 sm:text-[11px]">
                                    Chưa có ảnh
                                </p>

                            </div>

                        </div>

                    )

                }

            </div>

            {/* Body */}

            <div className="px-2 pb-3 pt-2">

                <h3
                    className="
                        text-center
        text-sm
        font-semibold
        text-gray-800
        whitespace-nowrap
        sm:text-[15px]
                    "
                >
                    {dish?.name || "Chưa có tên"}
                </h3>

                {dish?.subtitle && (

                    <p
                        className="
                            mt-1
                            text-center
                            text-[11px]
                            text-gray-500
                            line-clamp-2
                            sm:text-xs
                        "
                    >
                        {dish.subtitle}
                    </p>

                )}

            </div>

        </button>

    );

}

export default DishCard;