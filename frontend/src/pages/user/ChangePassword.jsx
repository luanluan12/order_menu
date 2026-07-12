import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";

import { changePassword } from "../../api/authApi";

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

const { logout } = useAuth();

    const submit = async () => {

        if (newPassword !== confirmPassword) {

            toast.error("Mật khẩu xác nhận không khớp.");

            return;

        }

        try {

            const res = await changePassword({

                oldPassword,

                newPassword

            });

            toast.success(res.data.message);

            setTimeout(() => {

    logout();

    navigate("/", {

        replace: true

    });

}, 1000);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Có lỗi xảy ra."

            );

        }

    };

    return (

        <div className="mx-auto mt-16 max-w-lg rounded-2xl bg-white p-8 shadow">

            <h1 className="mb-8 text-3xl font-bold">

                Đổi mật khẩu

            </h1>

            <div className="space-y-5">

                <input

                    type="password"

                    placeholder="Mật khẩu cũ"

                    value={oldPassword}

                    onChange={(e)=>

                        setOldPassword(e.target.value)

                    }

                    className="w-full rounded-xl border p-4"

                />

                <input

                    type="password"

                    placeholder="Mật khẩu mới"

                    value={newPassword}

                    onChange={(e)=>

                        setNewPassword(e.target.value)

                    }

                    className="w-full rounded-xl border p-4"

                />

                <input

                    type="password"

                    placeholder="Xác nhận mật khẩu"

                    value={confirmPassword}

                    onChange={(e)=>

                        setConfirmPassword(e.target.value)

                    }

                    className="w-full rounded-xl border p-4"

                />

                <button

                    onClick={submit}

                    className="w-full rounded-xl bg-orange-600 py-4 font-bold text-white hover:bg-orange-700"

                >

                    Đổi mật khẩu

                </button>

            </div>

        </div>

    );

}

export default ChangePassword;