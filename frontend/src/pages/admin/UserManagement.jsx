import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaKey,
    FaFileExcel
} from "react-icons/fa";
import { toast } from "react-toastify";

import UserModal from "../../components/UserModal";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    importExcel
} from "../../api/userApi";

function UserManagement() {

    const fileRef = useRef(null);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;

    const [openModal, setOpenModal] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    const handleAdd = () => {

        setEditingUser(null);

        setOpenModal(true);

    };

    const handleResetPassword = async (id) => {

        if (!window.confirm("Reset password?")) return;

        try {

            await resetPassword(id);

            toast.success("Reset password thành công");

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Reset thất bại"

            );

        }

    };

    const handleImportExcel = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("file", file);

        try {

            await importExcel(formData);

            toast.success("Import thành công");

            loadUsers();

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Import thất bại"

            );

        }

    };

    const handleEdit = (user) => {

        setEditingUser(user);

        setOpenModal(true);

    };

    const handleSave = async (form) => {

        try {

            if (editingUser) {

                await updateUser(

                    editingUser._id,

                    form

                );

                toast.success("Cập nhật thành công");

            }

            else {

                await createUser(form);

                toast.success("Thêm User thành công");

            }

            setOpenModal(false);

            setEditingUser(null);

            loadUsers();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Có lỗi"

            );

        }

    };

    const handleDelete = async (id) => {

        if (

            !window.confirm(

                "Bạn có chắc muốn xóa?"

            )

        )

            return;

        try {

            await deleteUser(id);

            toast.success("Đã xóa");

            loadUsers();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Không thể xóa"

            );

        }

    };

    const loadUsers = async () => {

        try {

            const res = await getUsers();

            const data = res.data.data ?? res.data;

            setUsers(data);

        } catch (err) {

            console.log(err);

            alert("Không tải được User");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);

    const filteredUsers = useMemo(() => {

        return users.filter(user => {

            const value = keyword.toLowerCase();

            return (

                user.employeeId?.toLowerCase().includes(value) ||

                user.name?.toLowerCase().includes(value) ||

                user.email?.toLowerCase().includes(value) ||

                user.floor?.toString().includes(value) ||

                user.role?.toLowerCase().includes(value)

            );

        });

    }, [users, keyword]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const displayUsers = filteredUsers.slice(

        (currentPage - 1) * pageSize,

        currentPage * pageSize

    );

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">


                <button onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >

                    <FaPlus />

                    Thêm User

                </button>

                <button

                    onClick={() => fileRef.current.click()}

                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white"

                >

                    <FaFileExcel />

                    Import Excel

                </button>

                <input

                    ref={fileRef}

                    type="file"

                    accept=".xlsx,.xls"

                    hidden

                    onChange={handleImportExcel}

                />

            </div>

            <div className="flex items-center w-96 border rounded-lg bg-white px-4 py-3">

                <FaSearch className="mr-3 text-gray-500" />

                <input

                    className="w-full outline-none"

                    placeholder="Search..."

                    value={keyword}

                    onChange={(e) => {

                        setKeyword(e.target.value);

                        setCurrentPage(1);

                    }}

                />

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">

                                Employee ID

                            </th>

                            <th className="px-4 py-3 text-left">

                                Name

                            </th>

                            <th className="px-4 py-3 text-left">

                                Email

                            </th>

                            <th className="px-4 py-3 text-center">

                                Floor

                            </th>

                            <th className="px-4 py-3 text-center">

                                Role

                            </th>

                            <th className="px-4 py-3 text-center">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="text-center py-10"
                                        >

                                            Loading...

                                        </td>

                                    </tr>

                                )

                                :

                                displayUsers.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan={6}
                                                className="text-center py-10"
                                            >

                                                Không có dữ liệu

                                            </td>

                                        </tr>

                                    )

                                    :

                                    displayUsers.map(user => (

                                        <tr
                                            key={user._id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-3">

                                                {user.employeeId}

                                            </td>

                                            <td className="px-4 py-3">

                                                {user.name}

                                            </td>

                                            <td className="px-4 py-3">

                                                {user.email}

                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                {user.floor}

                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                <span
                                                    className="bg-blue-100 text-blue-700 rounded px-3 py-1"
                                                >

                                                    {user.role}

                                                </span>

                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                <div className="flex justify-center gap-3">

                                                    <button

                                                        onClick={() =>

                                                            handleEdit(user)

                                                        }

                                                        className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"

                                                    >

                                                        <FaEdit />

                                                    </button>

                                                    <button

                                                        onClick={() =>

                                                            handleDelete(user._id)

                                                        }

                                                        className="rounded bg-red-500 p-2 text-white hover:bg-red-600"

                                                    >

                                                        <FaTrash />

                                                    </button>
                                                    <button

                                                        onClick={() =>

                                                            handleResetPassword(user._id)

                                                        }

                                                        className="rounded bg-yellow-500 p-2 text-white"

                                                    >

                                                        <FaKey />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>

            {

                totalPages > 1 &&

                <div className="flex justify-center gap-3">

                    {

                        [...Array(totalPages)].map((_, index) => (

                            <button

                                key={index}

                                onClick={() => setCurrentPage(index + 1)}

                                className={`

                                    px-4

                                    py-2

                                    rounded

                                    ${currentPage === index + 1

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-gray-200"

                                    }

                                `}

                            >

                                {index + 1}

                            </button>

                        ))

                    }

                </div>

            }
            <UserModal

                open={openModal}

                editingUser={editingUser}

                onClose={() => {

                    setOpenModal(false);

                    setEditingUser(null);

                }}

                onSave={handleSave}

            />
        </div>

    );

}

export default UserManagement;