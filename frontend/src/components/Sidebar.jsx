import {
  FaHome,
  FaUtensils,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();

    navigate("/");
  };

  const menus = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: FaHome,
    },

    ...(user?.role === "admin_eocmn"
      ? [
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
        ]
      : []),

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
    {
      to: "/admin/review",
      label: "Reviews",
      icon: FaStar,
    },
  ];

  return (
    <aside className="flex h-full w-full flex-col bg-white">
      {/* Logo */}

      <div className="flex justify-center border-b border-[#ECECF3] py-6">
        <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
      </div>

      {/* Menu */}

      <nav className="flex-1 px-3 py-5">
        <div className="space-y-2">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} onClick={() => onClose?.()}>
                {({ isActive }) => (
                  <div
                    className={`flex h-12 items-center rounded-xl px-4 transition-all duration-300

                                            ${
                                              isActive
                                                ? "bg-orange-500 text-white shadow"
                                                : "text-[#9197B3] hover:bg-orange-50"
                                            }`}
                  >
                    <div className="flex w-7 justify-center">
                      <Icon
                        className={isActive ? "text-white" : "text-[#9197B3]"}
                      />
                    </div>

                    <span
                      className={`ml-4 text-sm font-medium

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
          })}
        </div>
      </nav>

      {/* User */}

      <div className="border-t border-[#ECECF3] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-800">
              {user?.name}
            </h3>

            <p className="truncate text-xs text-[#9197B3]">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
