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
    publishMenu as publishMenuApi,
    scheduleResendMenu
} from "../../api/menuApi";

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const [publishingId, setPublishingId] = useState(null);
    const [publishMenu, setPublishMenu] = useState(null);
    const [publishing, setPublishing] = useState(false);
    const [resendMenu, setResendMenu] = useState(null);
    const [resendAt, setResendAt] = useState("");
    const [resending, setResending] = useState(false);

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

    // const handlePublish = async (menu) => {

    //     const confirmPublish = window.confirm(

    //         `Bạn có chắc muốn Gửi Menu tuần ${menu.week}?\n\n` +

    //         `Sau khi Publish sẽ gửi Email cho toàn bộ nhân viên.`

    //     );

    //     if (!confirmPublish) {

    //         return;

    //     }

    //     try {

    //         setPublishingId(menu._id);

    //         const res = await publishMenu(menu._id);

    //         toast.success(
    //             `${res.data.message} (${res.data.sent} email)`
    //         );

    //         await loadMenus();

    //     }


    //     catch (err) {

    //         toast.error(

    //             err.response?.data?.message ||

    //             err.message ||

    //             "Publish thất bại"

    //         );

    //     }
    //     finally {

    //         setPublishingId(null);

    //     }

    // };
    const handlePublish = (menu) => {
    setPublishMenu(menu);
};
const confirmPublish = async () => {

    if (!publishMenu) return;

    try {

        setPublishing(true);

        setPublishingId(publishMenu._id);

        const res = await publishMenuApi(publishMenu._id);

        toast.success(
            `${res.data.message} (${res.data.sent} email)`
        );

        setPublishMenu(null);

        await loadMenus();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Publish thất bại"
        );

    } finally {

        setPublishing(false);

        setPublishingId(null);

    }

};

    const handleResend = (menu) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 10, 0, 0);
        const localDateTime = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        setResendAt(localDateTime);
        setResendMenu(menu);
    };

    const confirmResend = async () => {
        if (!resendMenu || !resendAt) return;

        try {
            setResending(true);
            await scheduleResendMenu(resendMenu._id, new Date(resendAt).toISOString());
            toast.success(`Đã lên lịch gửi lại menu tuần ${resendMenu.week}.`);
            setResendMenu(null);
            await loadMenus();
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể lên lịch gửi lại menu");
        } finally {
            setResending(false);
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

                                                        Đã Gửi

                                                    </span>

                                                    :

                                                    <span className="rounded bg-yellow-100 px-3 py-1 text-yellow-700">

                                                        Chưa Gửi

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

                                                {menu.status === "published" && (
                                                    <button
                                                        onClick={() => handleResend(menu)}
                                                        className="rounded bg-amber-500 p-2 text-white hover:bg-amber-600"
                                                        title="Gửi lại cho người chưa đặt món"
                                                    >
                                                        <FaPaperPlane />
                                                    </button>
                                                )}

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

                                    Đã gửi

                                </span>

                                :

                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">

                                    Chưa Gửi

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

                        {menu.status === "published" && (
                            <button
                                onClick={() => handleResend(menu)}
                                className="flex-1 rounded-lg bg-amber-500 py-2 text-white"
                                title="Gửi lại cho người chưa đặt món"
                            >
                                <FaPaperPlane className="mx-auto" />
                            </button>
                        )}

                    </div>

                </div>

            ))

        )

    }

</div>

        {publishMenu && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold">
                Publish Menu
            </h2>

            <p className="mt-4 text-gray-700">
                Bạn có chắc muốn gửi menu{" "}
                <strong>{publishMenu.week}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">

                <button
                    disabled={publishing}
                    onClick={() => setPublishMenu(null)}
                    className="rounded-lg border px-5 py-2 hover:bg-gray-50"
                >
                    Hủy
                </button>

                <button
                    disabled={publishing}
                    onClick={confirmPublish}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-70"
                >
                    {publishing ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Đang Gửi...
                        </>
                    ) : (
                        <>
                            <FaPaperPlane />
                            Gửi
                        </>
                    )}
                </button>

            </div>

        </div>
    </div>
)}
        {resendMenu && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[460px] rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Gửi lại menu</h2>
            <p className="mt-3 text-gray-700">
                Hệ thống chỉ gửi lại menu <strong>{resendMenu.week}</strong> cho nhân viên đang hoạt động chưa đặt món tại thời điểm gửi.
            </p>
            <label className="mt-5 block text-sm font-medium text-gray-700">Thời điểm bắt đầu gửi</label>
            <input
                type="datetime-local"
                value={resendAt}
                onChange={(event) => setResendAt(event.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2"
                required
            />
            <div className="mt-6 flex justify-end gap-3">
                <button disabled={resending} onClick={() => setResendMenu(null)} className="rounded-lg border px-5 py-2 hover:bg-gray-50">Hủy</button>
                <button disabled={resending || !resendAt} onClick={confirmResend} className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-white hover:bg-amber-600 disabled:opacity-70">
                    <FaPaperPlane /> {resending ? "Đang lên lịch..." : "Xác nhận lịch gửi"}
                </button>
            </div>
        </div>
    </div>
)}
        </div>

    );
}

export default MenuManagement;
