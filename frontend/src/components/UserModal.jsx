import { useEffect, useState } from "react";

function UserModal({
    open,
    onClose,
    onSave,
    editingUser,
}) {
    const [form, setForm] = useState({
        employeeId: "",
        name: "",
        email: "",
        floor: "",
        role: "guest",
        password: "",
    });

    useEffect(() => {
        if (editingUser) {
            setForm({
                employeeId: editingUser.employeeId || "",
                name: editingUser.name || "",
                email: editingUser.email || "",
                floor: editingUser.floor || "",
                role: editingUser.role || "guest",
                password: "",
            });
        } else {
            setForm({
                employeeId: "",
                name: "",
                email: "",
                floor: "",
                role: "guest",
                password: "",
            });
        }
    }, [editingUser, open]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (!form.employeeId.trim()) {
            return alert("Nhập Employee ID");
        }

        if (!form.name.trim()) {
            return alert("Nhập tên");
        }

        if (!form.email.trim()) {
            return alert("Nhập Email");
        }

        if (!editingUser && !form.password.trim()) {
            return alert("Nhập mật khẩu");
        }

        onSave(form);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-[650px] rounded-xl bg-white p-8 shadow-2xl">

                <h2 className="mb-6 text-2xl font-bold">
                    {editingUser ? "Sửa User" : "Thêm User"}
                </h2>

                <div className="grid grid-cols-2 gap-5">

                    <div>
                        <label className="block mb-2">Employee ID</label>

                        <input
                            name="employeeId"
                            value={form.employeeId}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Tên</label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Floor</label>

                        <input
                            name="floor"
                            value={form.floor}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Role</label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="guest">Guest</option>
                            <option value="admin_eocmn">Admin EOCMN</option>
                            <option value="admin_nexon">Admin Nexon</option>
                        </select>
                    </div>

                    {!editingUser && (
                        <div>
                            <label className="block mb-2">Password</label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />
                        </div>
                    )}

                </div>

                <div className="mt-8 flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-300 px-6 py-3"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Lưu
                    </button>

                </div>

            </div>

        </div>
    );
}

export default UserModal;