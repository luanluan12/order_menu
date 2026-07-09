import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";

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

        } catch (err) {

            alert(

                err.response?.data?.message ||

                "Đăng nhập thất bại."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-orange-50 to-blue-100 px-4">

            <div className="w-full max-w-md rounded-[32px] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

                {/* Logo */}

                <div className="mb-8 flex flex-col items-center">

                    <img

                        src={logo}

                        alt="EOC"

                        className="h-24 object-contain"

                    />
                    <p className="mt-2 text-center text-gray-500">

                        Đăng nhập để đặt suất ăn hôm nay

                    </p>

                </div>

                <form

                    onSubmit={handleLogin}

                    className="space-y-5"

                >

                    {/* Email */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

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

                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"

                            required

                        />

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

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

                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 pr-14 text-lg outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"

                                required

                            />

                            <button

                                type="button"

                                onClick={() =>

                                    setShowPassword(

                                        !showPassword

                                    )

                                }

                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-600"

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

                        className="mt-2 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-fuchsia-600 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"

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