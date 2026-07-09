function AddDishCard({

    title,

    onClick

}) {

    return (

        <div className="mb-12">

            <h2 className="mb-4 text-xl font-bold">

                {title}

            </h2>

            <button

                type="button"

                onClick={onClick}

                className="flex h-40 w-72 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-lg font-semibold text-gray-500 transition hover:border-violet-500 hover:bg-violet-50 hover:text-violet-600"

            >

                + Thêm món

            </button>

        </div>

    );

}

export default AddDishCard;