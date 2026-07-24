import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const { logout } = useAuth();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    logout();

    setOpen(false);

    navigate("/", { replace: true });
  };

  return (
    <header className="flex h-24 items-center justify-between border-b border-gray-200 bg-[#F7F8FC] px-10">
      {/* Left */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Hello,
          <span className="ml-2 text-orange-600">{user?.name || "Admin"}</span>
          👋
        </h1>
      </div>

      {/* Right */}

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-orange-50"
        >
          <FaCog className="text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <button
              onClick={() => {
                setOpen(false);

                navigate("/change-password");
              }}
              className="flex w-full items-center gap-3 px-5 py-4 transition hover:bg-gray-50"
            >
              <FaKey />
              Đổi mật khẩu
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border-t px-5 py-4 text-red-600 transition hover:bg-red-50"
            >
              <FaSignOutAlt />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
