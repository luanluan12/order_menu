import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Lock, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

function Header() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const ref = useRef(null);

    useEffect(() => {

        const click = (e) => {

            if (
                ref.current &&
                !ref.current.contains(e.target)
            ) {

                setOpen(false);

            }

        };

        window.addEventListener("click", click);

        return () =>
            window.removeEventListener(
                "click",
                click
            );

    }, []);

    return (

        <header className="sticky top-0 z-50 border-b bg-white">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* LEFT */}

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white">

                        🍱

                    </div>

                    <div>

                        <div className="text-sm text-gray-500">

                            EOC Vietnam

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div
                    ref={ref}
                    className="relative"
                >

                    <button

                        onClick={() =>
                            setOpen(!open)
                        }

                        className="flex items-center gap-3 rounded-xl px-4 py-2 transition hover:bg-gray-100"

                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold text-white">

                            {

                                user?.name?.charAt(0)

                            }

                        </div>

                        <div className="text-left">

                            <div className="font-semibold">

                                {user?.name}

                            </div>

                        </div>

                        <ChevronDown size={18} />

                    </button>

                    {

                        open && (

                            <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border bg-white shadow-xl">

                                <div className="border-b p-5">

                                    <div className="font-bold">

                                        {user?.name}

                                    </div>

                                    <div className="text-sm text-gray-500">

                                        {user?.email}

                                    </div>

                                </div>

                                <button

                                    onClick={() =>
                                        navigate("/change-password")
                                    }

                                    className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50"

                                >

                                    <Lock size={18} />

                                    Đổi mật khẩu

                                </button>

                                <button

                                    onClick={() =>
                                        navigate("/history")
                                    }

                                    className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50"

                                >

                                    <ClipboardList size={18} />

                                    Lịch sử đặt món

                                </button>

                                <button

                                    onClick={() => {

                                        logout();

                                        navigate("/");

                                    }}

                                    className="flex w-full items-center gap-3 border-t px-5 py-4 text-red-600 hover:bg-red-50"

                                >

                                    <LogOut size={18} />

                                    Đăng xuất

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>

        </header>

    );

}

export default Header;