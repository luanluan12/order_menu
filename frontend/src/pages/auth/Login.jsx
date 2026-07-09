import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await loginApi({

                email,

                password

            });

            login(

                res.data.token,

                res.data.user

            );

            switch (res.data.user.role) {

                case "guest":

                    navigate("/home");

                    break;

                case "admin_eocmn":

                case "admin_nexon":

                    navigate("/admin/dashboard");

                    break;

                default:

                    navigate("/");

            }

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Đăng nhập thất bại."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-100 via-white to-blue-100">

            <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

                {/* Logo */}

                <div className="mb-10 text-center">

                    <div className="text-6xl">

                        🍱

                    </div>

                    <h1 className="mt-4 text-3xl font-bold">

                        Order Menu

                    </h1>

                    <p className="mt-2 text-gray-500">

                        Hệ thống đặt suất ăn công ty

                    </p>

                </div>

                <form

                    onSubmit={handleLogin}

                    className="space-y-6"

                >

                    {/* Email */}

                    <div>

                        <label className="mb-2 block font-semibold">

                            Email

                        </label>

                        <input

                            type="email"

                            value={email}

                            onChange={(e) =>

                                setEmail(

                                    e.target.value

                                )

                            }

                            placeholder="example@gmail.com"

                            className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-violet-500"

                            required

                        />

                    </div>

                    {/* Password */}

                    <div>

    <label className="mb-2 block font-semibold">

        Mật khẩu

    </label>

    <div className="relative">

        <input

            type={

                showPassword

                    ? "text"

                    : "password"

            }

            value={password}

            onChange={(e) =>

                setPassword(

                    e.target.value

                )

            }

            placeholder="********"

            className="w-full rounded-xl border border-gray-300 p-4 pr-12 outline-none transition focus:border-violet-500"

            required

        />

        <button

            type="button"

            onClick={() =>

                setShowPassword(

                    !showPassword

                )

            }

            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600"

        >

            {

                showPassword

                    ?

                    <EyeOff size={22} />

                    :

                    <Eye size={22} />

            }

        </button>

    </div>

</div>

                    {/* Button */}

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full rounded-xl bg-violet-600 py-4 text-lg font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"

                    >

                        {

                            loading

                                ?

                                "Đang đăng nhập..."

                                :

                                "Đăng nhập"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;