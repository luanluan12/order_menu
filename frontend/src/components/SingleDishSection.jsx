import { Plus } from "lucide-react";
import DishCard from "./DishCard";

function SingleDishSection({
    title,
    dish,
    onSelect,
    onAdd,
}) {
    const hasDish =
        dish?.name || dish?.image;

    return (
        <section className="w-full space-y-6">
            {/* Header */}

            <div>
                <h2 className="text-[26px] font-bold text-slate-800">
                    {title}
                </h2>
            </div>

            {/* Card */}

            {hasDish ? (
                <DishCard
                    dish={dish}
                    onClick={onSelect}
                />
            ) : (
                <button
                    type="button"
                    onClick={onAdd}
                    className="
                        group
                        flex
                        h-[175px]
                        w-[145px]
                        flex-col
                        items-center
                        justify-center
                        rounded-[24px]
                        border-2
                        border-dashed
                        border-orange-300
                        bg-orange-50
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-orange-500
                        hover:bg-orange-100
                        hover:shadow-lg
                    "
                >
                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            shadow
                            transition
                            group-hover:scale-110
                        "
                    >
                        <Plus
                            size={30}
                            className="text-orange-500"
                        />
                    </div>

                    <p className="mt-5 text-lg font-bold text-orange-600">
                        Thêm món
                    </p>
                </button>
            )}
        </section>
    );
}

export default SingleDishSection;