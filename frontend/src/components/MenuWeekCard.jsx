import { FaEdit, FaEye, FaTrash, FaUpload } from "react-icons/fa";

function MenuWeekCard({

    menu,

    onEdit,

    onDelete,

    onPublish,

    onView

}) {

    const firstDay = menu.days?.[0]?.date;

    const lastDay = menu.days?.[4]?.date;

    const statusColor = {

        draft: "bg-yellow-100 text-yellow-700",

        published: "bg-green-100 text-green-700",

        closed: "bg-red-100 text-red-700"

    };

    return (

        <div className="rounded-xl border bg-white p-6 shadow">

            <div className="flex items-start justify-between">

                <div>

                    <h2 className="text-2xl font-bold">

                        🍱 {menu.week}

                    </h2>

                    <p className="mt-2 text-gray-500">

                        {firstDay}

                        {" - "}

                        {lastDay}

                    </p>

                    <p className="mt-1 text-sm text-gray-400">

                        {menu.days?.length || 0} ngày

                    </p>

                </div>

                <span

                    className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColor[menu.status]}`}

                >

                    {menu.status}

                </span>

            </div>

            <div className="mt-6 flex gap-3">

                <button

                    onClick={() => onView(menu)}

                    className="rounded-lg bg-gray-100 p-3"

                >

                    <FaEye />

                </button>

                <button

                    onClick={() => onEdit(menu)}

                    className="rounded-lg bg-blue-500 p-3 text-white"

                >

                    <FaEdit />

                </button>

                {

                    menu.status !== "published" &&

                    <button

                        onClick={() => onPublish(menu._id)}

                        className="rounded-lg bg-green-500 p-3 text-white"

                    >

                        <FaUpload />

                    </button>

                }

                {

                    menu.status !== "published" &&

                    <button

                        onClick={() => onDelete(menu._id)}

                        className="rounded-lg bg-red-500 p-3 text-white"

                    >

                        <FaTrash />

                    </button>

                }

            </div>

        </div>

    );

}

export default MenuWeekCard;