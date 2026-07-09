import { Plus } from "lucide-react";

function AddDishCard({
    title,
    onClick,
}) {
    return (
        <div className="mb-10">

            <h2 className="mb-4 text-xl font-bold text-slate-800">
                {title}
            </h2>

            <button
                type="button"
                onClick={onClick}
                className="
                    group
                    flex
                    h-[140px]
                    w-[170px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[22px]
                    border-2
                    border-dashed
                    border-orange-300
                    bg-orange-50
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-orange-500
                    hover:bg-orange-100
                    hover:shadow-md
                "
            >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Plus
                        size={24}
                        className="text-orange-500 transition group-hover:scale-110"
                    />
                </div>

                <span className="mt-3 text-sm font-semibold text-orange-600">
                    Thêm món
                </span>

            </button>

        </div>
    );
}

export default AddDishCard;