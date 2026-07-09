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
            <div className="flex items-center justify-between">

                <button
    onClick={() => navigate("/admin/menu/create")}
    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-violet-700 hover:shadow-lg"
>
    <span className="text-lg">+</span>

    <span>Tạo Menu Tuần</span>
</button>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-xl bg-white shadow">

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

        </div>

    );
}

export default MenuManagement;