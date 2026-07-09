import {
    FaHome,
    FaUtensils,
    FaUsers,
    FaClipboardList,
    FaChartBar,
    FaSignOutAlt,
    FaChevronRight,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

function Sidebar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    const menus = [

        {
            to: "/admin/dashboard",
            label: "Dashboard",
            icon: FaHome,
        },

        {
            to: "/admin/menu",
            label: "Menu",
            icon: FaUtensils,
        },

        {
            to: "/admin/user",
            label: "Users",
            icon: FaUsers,
        },

        {
            to: "/admin/order",
            label: "Orders",
            icon: FaClipboardList,
        },

        {
            to: "/admin/report",
            label: "Reports",
            icon: FaChartBar,
        },

    ];

    return (

<aside className="flex h-screen w-[250px] flex-col border-r border-[#ECECF3] bg-white">
            {/* Logo */}
            <div className="flex justify-center py-8">

    <img
        src={logo}
        alt="Logo"
        className="h-30 w-auto object-contain"
    />

</div>

            <nav className="mt-2 flex-1 px-2">

                <div className="space-y-2">

                    {

                        menus.map((item) => {

                            const Icon = item.icon;

                            return (

                                <NavLink
    key={item.to}
    to={item.to}
>
    {({ isActive }) => (

        <div
            className={`mx-3 flex h-12 items-center rounded-xl px-4 transition-all duration-300

            ${
                isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-[#9197B3] hover:bg-orange-50"
            }`}
        >

            {/* Icon */}

            <div className="flex w-8 items-center justify-center">

                <Icon
                    className={
                        isActive
                            ? "text-white text-[16px]"
                            : "text-[#9197B3] text-[16px]"
                    }
                />

            </div>

            {/* Text */}

            <span
                className={`ml-4 flex-1 text-[14px] font-medium

                ${
                    isActive
                        ? "text-white"
                        : "text-[#9197B3]"
                }`}
            >

                {item.label}

            </span>

        </div>

    )}
</NavLink>

                            );

                        })

                    }

                </div>

            </nav>

            {/* User */}

            <div className="border-t border-[#ECECF3] px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">

                        {user?.name?.charAt(0).toUpperCase() || "A"}

                    </div>

                    <div>

                        <h3 className="text-sm font-semibold text-gray-800">

                            {user?.name}

                        </h3>

                        <p className="text-xs text-[#9197B3]">

                            {user?.role}

                        </p>

                    </div>

                </div>

                <button

                    onClick={logout}

                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500 font-medium text-white transition hover:bg-red-600"

                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;