import {
    FaHome,
    FaUtensils,
    FaUsers,
    FaClipboardList,
    FaChartBar,
    FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-slate-700 hover:text-white"
        }`;

    return (
        <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl">
            {/* Logo */}
            <div className="border-b border-slate-700 p-6">
                <h1 className="text-2xl font-bold text-blue-400">
                    Food Admin
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Food Ordering System
                </p>
            </div>

            {/* User */}
            <div className="border-b border-slate-700 p-5">
                <p className="text-sm text-gray-400">
                    Xin chào
                </p>

                <h2 className="mt-1 font-semibold">
                    {user?.name}
                </h2>

                <p className="text-xs text-blue-400">
                    {user?.role}
                </p>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-2 p-4">

                <NavLink
                    to="/admin/dashboard"
                    className={menuClass}
                >
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/menu"
                    className={menuClass}
                >
                    <FaUtensils />
                    Menu
                </NavLink>

                <NavLink
                    to="/admin/user"
                    className={menuClass}
                >
                    <FaUsers />
                    User
                </NavLink>

                <NavLink
                    to="/admin/order"
                    className={menuClass}
                >
                    <FaClipboardList />
                    Order
                </NavLink>

                <NavLink
                    to="/admin/report"
                    className={menuClass}
                >
                    <FaChartBar />
                    Report
                </NavLink>

            </nav>

            {/* Logout */}
            <div className="border-t border-slate-700 p-4">

                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-500 px-4 py-3 font-medium transition hover:bg-red-600"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>
        </aside>
    );
}

export default Sidebar;