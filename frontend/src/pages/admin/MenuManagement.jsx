import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import MenuWeekCard from "../../components/MenuWeekCard";

import { toast } from "react-toastify";

import {
    FaEdit,
    FaTrash,
    FaSearch,
    FaPaperPlane,
} from "react-icons/fa";

import {
    getMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    publishMenu
} from "../../api/menuApi";

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const [publishingId, setPublishingId] = useState(null);

    const loadMenus = async () => {

        try {

            const res = await getMenus();

            const data = res.data.data ?? res.data;

            setMenus(data);

            setFilteredMenus(data);

        } catch (err) {

            console.log(err);

            toast.error("Không tải được Menu");

        }

    };

    const handleAdd = () => {

        setEditingMenu(null);

        setOpenModal(true);

    };

    const handleEdit = (menu) => {

        navigate(

            `/admin/menu/edit/${menu._id}`

        );

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa Menu?"
        );

        if (!confirmDelete) return;

        try {

            await deleteMenu(id);

            toast.success("Xóa thành công");

            loadMenus();

        } catch (err) {

            alert(

                err.response?.data?.message ||

                "Không thể xóa"

            );

        }

    };

    const handlePublish = async (menu) => {

        const confirmPublish = window.confirm(

            `Bạn có chắc muốn Gửi Menu tuần ${menu.week}?\n\n` +

            `Sau khi Publish sẽ gửi Email cho toàn bộ nhân viên.`

        );

        if (!confirmPublish) {

            return;

        }

        try {

            setPublishingId(menu._id);

            const res = await publishMenu(menu._id);

            toast.success(
                `${res.data.message} (${res.data.sent} email)`
            );

            await loadMenus();

        }


        catch (err) {

            toast.error(

                err.response?.data?.message ||

                err.message ||

                "Publish thất bại"

            );

        }
        finally {

            setPublishingId(null);

        }

    };

    useEffect(() => {
        loadMenus();
    }, []);

    useEffect(() => {

        const value = keyword.trim().toLowerCase();

        if (!value) {

            setFilteredMenus(menus);

            return;

        }

        const result = menus.filter(menu =>

            menu.days?.some(day =>

                day.mains?.some(item =>
                    item.name.toLowerCase().includes(value)
                ) ||

                day.drinks?.some(item =>
                    item.name.toLowerCase().includes(value)
                ) ||

                day.soups?.some(item =>
                    item.name.toLowerCase().includes(value)
                ) ||

                day.desserts?.some(item =>
                    item.name.toLowerCase().includes(value)
                )

            )

        );

        setFilteredMenus(result);

    }, [keyword, menus]);

    return (
        <div className="space-y-6">

            {/* Title */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <button
    onClick={() => navigate("/admin/menu/create")}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-orange-700 sm:w-auto"
>
    <span className="text-lg">+</span>

    <span>Tạo Menu Tuần</span>
</button>

            </div>

            {/* Table */}

            <div className="hidden overflow-hidden rounded-xl bg-white shadow lg:block">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">
                                Tuần
                            </th>

                            <th className="px-4 py-3 text-center">
                                Năm
                            </th>

                            <th className="px-4 py-3 text-center">
                                Số ngày
                            </th>

                            <th className="px-4 py-3 text-center">
                                Trạng thái
                            </th>

                            <th className="px-4 py-3 text-center">
                                Ngày tạo
                            </th>

                            <th className="px-4 py-3 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredMenus.length === 0 ?

                                (

                                    <tr>

                                        <td
                                            colSpan={7}
                                            className="py-10 text-center"
                                        >

                                            Không có dữ liệu

                                        </td>

                                    </tr>

                                )

                                :


                                filteredMenus.map(menu => (

                                    <tr
                                        key={menu._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-3 font-semibold">

                                            {menu.week}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {menu.year}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {menu.days?.length || 0}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {

                                                menu.status === "published"

                                                    ?

                                                    <span className="rounded bg-green-100 px-3 py-1 text-green-700">

                                                        Published

                                                    </span>

                                                    :

                                                    <span className="rounded bg-yellow-100 px-3 py-1 text-yellow-700">

                                                        Draft

                                                    </span>

                                            }

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {

                                                new Date(menu.createdAt)

                                                    .toLocaleDateString("vi-VN")

                                            }

                                        </td>

                                        <td className="px-4 py-3">

                                            <div className="flex justify-center gap-3">

                                                <button
                                                    onClick={() => handleEdit(menu)}
                                                    className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(menu._id)}
                                                    className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
                                                >
                                                    <FaTrash />
                                                </button>

                                                <button
                                                    disabled={
                                                        menu.status === "published" ||
                                                        publishingId === menu._id
                                                    }
                                                    onClick={() => handlePublish(menu)}
                                                    className={`rounded p-2 text-white ${menu.status === "published"
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-500 hover:bg-green-600"
                                                        }`}
                                                >
                                                    <FaPaperPlane />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>
            <div className="space-y-4 lg:hidden">

    {

        filteredMenus.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow">

                Không có dữ liệu

            </div>

        ) : (

            filteredMenus.map(menu => (

                <div
                    key={menu._id}
                    className="rounded-2xl bg-white p-5 shadow"
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-bold">

                                {menu.week}

                            </h2>

                            <p className="text-sm text-gray-500">

                                Năm {menu.year}

                            </p>

                        </div>

                        {

                            menu.status === "published"

                                ?

                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                                    Published

                                </span>

                                :

                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">

                                    Draft

                                </span>

                        }

                    </div>

                    <div className="mt-4 space-y-2 text-sm">

                        <div className="flex justify-between">

                            <span className="text-gray-500">

                                Số ngày

                            </span>

                            <span>

                                {menu.days?.length || 0}

                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-gray-500">

                                Ngày tạo

                            </span>

                            <span>

                                {

                                    new Date(menu.createdAt)

                                        .toLocaleDateString("vi-VN")

                                }

                            </span>

                        </div>

                    </div>

                    <div className="mt-5 flex gap-2">

                        <button
                            onClick={() => handleEdit(menu)}
                            className="flex-1 rounded-lg bg-blue-500 py-2 text-white"
                        >

                            <FaEdit className="mx-auto" />

                        </button>

                        <button
                            onClick={() => handleDelete(menu._id)}
                            className="flex-1 rounded-lg bg-red-500 py-2 text-white"
                        >

                            <FaTrash className="mx-auto" />

                        </button>

                        <button

                            disabled={
                                menu.status === "published" ||
                                publishingId === menu._id
                            }

                            onClick={() => handlePublish(menu)}

                            className={`flex-1 rounded-lg py-2 text-white ${
                                menu.status === "published"
                                    ? "bg-gray-400"
                                    : "bg-green-500"
                            }`}

                        >

                            <FaPaperPlane className="mx-auto" />

                        </button>

                    </div>

                </div>

            ))

        )

    }

</div>

        </div>

    );
}

export default MenuManagement;