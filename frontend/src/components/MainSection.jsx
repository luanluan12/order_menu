// import { Plus } from "lucide-react";
// import DishCard from "./DishCard";

// function MainSection({
//     mains,
//     onSelect,
//     onAdd,
// }) {
//     return (
//         <section className="space-y-6">

//             {/* Header */}

//             <div className="flex items-center justify-between">

//                 <div>

//                     <h2 className="text-[26px] font-bold text-slate-800">
//                         Món cơm
//                     </h2>
//                 </div>

//                 <div className="rounded-full bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-600">
//                     {mains.length}/5 món
//                 </div>

//             </div>

//             {/* Cards */}

//             <div
//     className="
//         grid
//         grid-cols-5
//         gap-8
//         justify-items-center
//         items-start
//     "
// >

//                 {mains.map((dish, index) => (

//                     <DishCard
//                         key={index}
//                         dish={dish}
//                         onClick={() => onSelect(index)}
//                     />

//                 ))}

//                 {mains.length < 5 && (

//                     <button
//                         type="button"
//                         onClick={onAdd}
//                         className="
//                             group
//                             flex
//                             h-[197px]
//                             w-[145px]
//                             flex-col
//                             items-center
//                             justify-center
//                             rounded-[24px]
//                             border-2
//                             border-dashed
//                             border-orange-300
//                             bg-orange-50
//                             transition-all
//                             duration-300
//                             hover:-translate-y-1
//                             hover:border-orange-500
//                             hover:bg-orange-100
//                             hover:shadow-lg
//                         "
//                     >

//                         <div
//                             className="
//                                 flex
//                                 h-16
//                                 w-16
//                                 items-center
//                                 justify-center
//                                 rounded-full
//                                 bg-white
//                                 shadow
//                                 transition
//                                 group-hover:scale-110
//                             "
//                         >
//                             <Plus
//                                 size={30}
//                                 className="text-orange-500"
//                             />
//                         </div>

//                         <p className="mt-5 text-lg font-bold text-orange-600">
//                             Thêm món
//                         </p>

//                     </button>

//                 )}

//             </div>

//         </section>
//     );
// }

// export default MainSection;

import { Plus } from "lucide-react";
import DishCard from "./DishCard";

function MainSection({
    mains,
    onSelect,
    onAdd,
}) {

    return (

        <section className="space-y-5">

            {/* Header */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2 className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-[26px]">

                        Món cơm

                    </h2>

                </div>

                <div className="self-start rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">

                    {mains.length}/5 món

                </div>

            </div>

            {/* Cards */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-4
                    sm:grid-cols-3
                    lg:grid-cols-5
                    lg:gap-8
                    justify-items-center
                    items-start
                "
            >

                {

                    mains.map((dish, index) => (

                        <DishCard

                            key={index}

                            dish={dish}

                            onClick={() => onSelect(index)}

                        />

                    ))

                }

                {

                    mains.length < 5 && (

                        <button

                            type="button"

                            onClick={onAdd}

                            className="
                                group
                                flex
                                h-[170px]
                                w-full
                                max-w-[150px]
                                flex-col
                                items-center
                                justify-center
                                rounded-2xl
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
                                sm:h-[185px]
                                lg:h-[197px]
                            "

                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    shadow
                                    transition
                                    group-hover:scale-110
                                    sm:h-16
                                    sm:w-16
                                "
                            >

                                <Plus

                                    size={28}

                                    className="text-orange-500"

                                />

                            </div>

                            <p className="mt-4 text-base font-bold text-orange-600 sm:text-lg">

                                Thêm món

                            </p>

                        </button>

                    )

                }

            </div>

        </section>

    );

}

export default MainSection;