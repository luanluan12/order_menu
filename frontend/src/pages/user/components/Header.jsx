import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Lock,
    ClipboardList,
    LogOut,
    QrCode,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/logo.png";

function Header() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const { i18n, t } = useTranslation();

    const [open, setOpen] = useState(false);

    const ref = useRef(null);

    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang);

        localStorage.setItem("language", lang);

    };

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

            window.removeEventListener("click", click);

    }, []);

    return (

        <header className="sticky top-0 z-50 border-b border-white/30 bg-white/20 backdrop-blur-xl">

            <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">

                {/* Logo */}

                <div className="flex items-center">

                    <img

                        src={logo}

                        alt="Logo"

                        className="h-16 w-auto object-contain sm:h-24 lg:h-32"

                    />

                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    {/* Language */}

                    <div className="overflow-hidden rounded-xl border border-white/40 bg-white/30 shadow-md backdrop-blur-md">

                        <button
    onClick={() => changeLanguage("vi")}
    className={`px-3 py-2 transition ${
        i18n.language === "vi"
            ? "bg-orange-500 text-white"
            : "text-gray-700 hover:bg-white/40"
    }`}
>
    🇻🇳
</button>

                        <button
    onClick={() => changeLanguage("ko")}
    className={`px-3 py-2 transition ${
        i18n.language === "ko"
            ? "bg-orange-500 text-white"
            : "text-gray-700 hover:bg-white/40"
    }`}
>
    🇰🇷
</button>

                    </div>

                    {/* User */}

                    <div

                        ref={ref}

                        className="relative"

                    >

                        <button

                            onClick={() => setOpen(!open)}

                            className="flex items-center gap-2 rounded-2xl bg-white/30 px-3 py-2 shadow-md backdrop-blur-md transition hover:bg-white/40 sm:gap-3 sm:px-4"

                        >

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white sm:h-10 sm:w-10">

                                {user?.name?.charAt(0)}

                            </div>

                            <div className="hidden text-left sm:block">

                                <div className="font-semibold">

                                    {user?.name}

                                </div>

                            </div>

                            <ChevronDown size={18} />

                        </button>

                        {

                            open && (

                                <div className="absolute right-0 mt-3 w-[280px] max-w-[90vw] overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-xl">

                                    <div className="border-b p-5">

                                        <div className="font-bold">

                                            {user?.name}

                                        </div>

                                        <div className="break-all text-sm text-gray-500">

                                            {user?.email}

                                        </div>

                                    </div>

                                    <button

                                        onClick={() => {

                                            setOpen(false);

                                            navigate("/change-password");

                                        }}

                                        className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50"

                                    >

                                        <Lock size={18} />

                                        {t("change_password")}

                                    </button>

                                    <button

                                        onClick={() => {

                                            setOpen(false);

                                            navigate("/history");

                                        }}

                                        className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50"

                                    >

                                        <ClipboardList size={18} />

                                        {t("history")}

                                    </button>

                                    <button

    onClick={() => {

        setOpen(false);

        navigate("/checkin");

    }}

    className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50"

>

    <QrCode size={18} />

    {t("check_in")}

</button>

                                    <button

                                        onClick={() => {

                                            setOpen(false);

                                            logout();

                                            navigate("/");

                                        }}

                                        className="flex w-full items-center gap-3 border-t px-5 py-4 text-red-600 hover:bg-red-50"

                                    >

                                        <LogOut size={18} />

                                        {t("logout")}

                                    </button>

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

            <div className="mx-auto max-w-[1080px] border-b-2 border-orange-400"></div>

        </header>

    );

}

export default Header;